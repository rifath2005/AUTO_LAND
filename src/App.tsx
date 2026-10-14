import React, { useState, useEffect } from 'react';
import { 
  NavScreen, 
  CollegeContact, 
  SystemStats, 
  ActivityFeedItem, 
  EmailTemplate, 
  Campaign, 
  DispatchAuditRecord 
} from './types';
import { 
  initialColleges, 
  initialSystemStats, 
  initialActivities, 
  initialTemplates, 
  initialCampaigns, 
  initialAuditLogs 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast, ToastMessage } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';
import { NewCampaignModal } from './components/NewCampaignModal';
import { CollegeDetailModal } from './components/CollegeDetailModal';

// Views
import { DashboardView } from './views/DashboardView';
import { CollegeContactsView } from './views/CollegeContactsView';
import { ImportContactsView } from './views/ImportContactsView';
import { WebsiteResearchView } from './views/WebsiteResearchView';
import { EmailTemplatesView } from './views/EmailTemplatesView';
import { CampaignsView } from './views/CampaignsView';
import { SendHistoryView } from './views/SendHistoryView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');
  const [colleges, setColleges] = useState<CollegeContact[]>(initialColleges);
  const [stats, setStats] = useState<SystemStats>(initialSystemStats);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(initialActivities);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [auditLogs, setAuditLogs] = useState<DispatchAuditRecord[]>(initialAuditLogs);

  // Modals & Drawers
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedCollegeModal, setSelectedCollegeModal] = useState<CollegeContact | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [contactsFilter, setContactsFilter] = useState<string>('');

  // Integrations state
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [gmailActive, setGmailActive] = useState(false);

  // Global toast trigger
  const triggerToast = (message: string, icon: string = 'info') => {
    setToast({
      id: String(Date.now()),
      message,
      icon
    });
  };

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Navigate handler with optional filter
  const handleNavigate = (screen: NavScreen, filter?: string) => {
    setCurrentScreen(screen);
    if (filter) {
      setContactsFilter(filter);
    } else {
      setContactsFilter('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select college by name (e.g. from live feed)
  const handleSelectCollegeByName = (name: string) => {
    const found = colleges.find(c => 
      c.name.toLowerCase().includes(name.toLowerCase()) || 
      (c.shortName && c.shortName.toLowerCase().includes(name.toLowerCase()))
    );
    if (found) {
      setSelectedCollegeModal(found);
    } else {
      triggerToast(`Showing records for ${name}`, 'info');
      handleNavigate('college-contacts', name);
    }
  };

  // Schedule / Create Campaign
  const handleScheduleCampaign = (newCamp: Partial<Campaign>) => {
    const id = `cmp-${Date.now()}`;
    const targetCount = newCamp.targetCount || 1180;
    const campaignRecord: Campaign = {
      id,
      name: newCamp.name || 'New Regional Campaign Wave',
      targetZone: newCamp.targetZone || 'All Tamil Nadu (38 Districts)',
      templateId: newCamp.templateId || 'tpl-1',
      templateName: newCamp.templateName || 'Official Notification',
      status: 'In Progress',
      targetCount,
      sentCount: 0,
      deliveredCount: 0,
      bouncedCount: 0,
      createdAt: 'Just now',
      velocityThrottle: newCamp.velocityThrottle || 45
    };

    setCampaigns(prev => [campaignRecord, ...prev]);

    // Add activity record
    const newActivity: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      collegeName: `Campaign Launched: ${campaignRecord.name}`,
      action: 'Batch Dispatched',
      description: `Targeting ${targetCount} institutions at ${campaignRecord.velocityThrottle} msgs/min`,
      timeAgo: 'Just now',
      statusBadge: 'Scheduled',
      statusType: 'sent',
      subBadge: campaignRecord.targetZone.slice(0, 24),
      icon: 'rocket_launch',
      iconBg: 'bg-primary-container',
      iconColor: 'text-on-primary'
    };
    setActivities(prev => [newActivity, ...prev]);

    triggerToast(`Mock Campaign Scheduled! ${targetCount} simulated dispatches queued for delivery.`, 'mark_email_read');
  };

  // Single test email
  const handleSendTestEmail = (college: CollegeContact, templateTitle?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    // Add audit log
    const auditRecord: DispatchAuditRecord = {
      id: `aud-${Date.now()}`,
      collegeName: college.name,
      aisheCode: college.aisheCode,
      recipientEmail: college.principalEmail,
      recipientTitle: 'Principal',
      campaignName: templateTitle || 'Direct Single Test Dispatch',
      timestamp: `${now.toISOString().slice(0, 10)} ${timeStr}`,
      status: 'Delivered',
      zone: college.zone,
      ipNode: 'gateway-chn-01.tn.gov.in'
    };
    setAuditLogs(prev => [auditRecord, ...prev]);

    // Increment dispatched count in stats
    setStats(prev => ({
      ...prev,
      dispatched: prev.dispatched + 1
    }));

    // Add activity feed
    const activity: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      collegeName: college.name,
      action: 'Test Outreach Sent',
      description: `Test dispatch delivered to ${college.principalEmail}`,
      timeAgo: 'Just now',
      statusBadge: 'Verified',
      statusType: 'verified',
      subBadge: `AISHE ${college.aisheCode}`,
      icon: 'mark_email_read',
      iconBg: 'bg-surface-container-highest',
      iconColor: 'text-tertiary'
    };
    setActivities(prev => [activity, ...prev]);

    triggerToast(`Test email transmitted to ${college.principalEmail} (${college.name})`, 'send');
  };

  // Simulate Campaign progress stream
  const handleSimulateBatch = (campaignId: string, count: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const nextSent = Math.min(c.targetCount, c.sentCount + count);
        const isFinished = nextSent >= c.targetCount;
        return {
          ...c,
          sentCount: nextSent,
          deliveredCount: c.deliveredCount + count,
          status: isFinished ? 'Completed' : 'In Progress'
        };
      }
      return c;
    }));

    setStats(prev => ({
      ...prev,
      dispatched: prev.dispatched + count
    }));
  };

  // Update college in list
  const handleUpdateCollege = (updated: CollegeContact) => {
    setColleges(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedCollegeModal?.id === updated.id) {
      setSelectedCollegeModal(updated);
    }
  };

  // Add new college
  const handleAddCollege = (newCollege: CollegeContact) => {
    setColleges(prev => [newCollege, ...prev]);
    setStats(prev => ({
      ...prev,
      totalColleges: prev.totalColleges + 1,
      verifiedRecords: prev.verifiedRecords + 1
    }));
  };

  // Refresh mock ledger
  const handleRefreshData = () => {
    setStats({ ...initialSystemStats, dispatched: initialSystemStats.dispatched + Math.floor(Math.random() * 5) });
  };

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col font-body-md antialiased selection:bg-[#ffdad6] selection:text-[#410002]">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sidebar Navigation Rail */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        sheetsConnected={sheetsConnected}
        gmailActive={gmailActive}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="pl-0 lg:pl-64 flex flex-col min-h-screen transition-all">
        {/* Global Header */}
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onTriggerToast={triggerToast}
        />

        {/* Content Canvas */}
        <main className="w-full pt-16 bg-background px-space-md lg:px-space-lg min-h-screen flex-1">
          <div className="pt-space-md">
            {currentScreen === 'dashboard' && (
              <DashboardView
                stats={stats}
                activities={activities}
                colleges={colleges}
                onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
                onNavigate={handleNavigate}
                onTriggerToast={triggerToast}
                onSelectCollegeByName={handleSelectCollegeByName}
                onRefreshData={handleRefreshData}
              />
            )}

            {currentScreen === 'college-contacts' && (
              <CollegeContactsView
                colleges={colleges}
                initialFilter={contactsFilter}
                onSelectCollege={(c) => setSelectedCollegeModal(c)}
                onSendTestEmail={handleSendTestEmail}
                onAddCollege={handleAddCollege}
                onTriggerToast={triggerToast}
                onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
              />
            )}

            {currentScreen === 'import-contacts' && (
              <ImportContactsView
                onImportSuccess={(count) => {
                  setSheetsConnected(true);
                  setStats(prev => ({
                    ...prev,
                    deduplicated: 80,
                    verifiedRecords: 1180
                  }));
                }}
                onTriggerToast={triggerToast}
              />
            )}

            {currentScreen === 'website-research' && (
              <WebsiteResearchView
                colleges={colleges}
                onEnrichCollege={handleUpdateCollege}
                onTriggerToast={triggerToast}
              />
            )}

            {currentScreen === 'email-templates' && (
              <EmailTemplatesView
                templates={templates}
                colleges={colleges}
                onSaveTemplate={(tpl) => {
                  setTemplates(prev => prev.map(t => t.id === tpl.id ? tpl : t));
                }}
                onSendTestEmail={handleSendTestEmail}
                onTriggerToast={triggerToast}
              />
            )}

            {currentScreen === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                colleges={colleges}
                onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
                onSimulateBatch={handleSimulateBatch}
                onTriggerToast={triggerToast}
              />
            )}

            {currentScreen === 'send-history' && (
              <SendHistoryView
                auditLogs={auditLogs}
                onTriggerToast={triggerToast}
                onNavigateToResearch={() => handleNavigate('website-research')}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsView
                stats={stats}
                onUpdateStats={(newSt) => setStats(prev => ({ ...prev, ...newSt }))}
                sheetsConnected={sheetsConnected}
                onToggleSheets={setSheetsConnected}
                gmailActive={gmailActive}
                onToggleGmail={setGmailActive}
                onTriggerToast={triggerToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        templates={templates}
        onScheduleCampaign={handleScheduleCampaign}
      />

      <CollegeDetailModal
        college={selectedCollegeModal}
        onClose={() => setSelectedCollegeModal(null)}
        onUpdate={handleUpdateCollege}
        onSendTestEmail={handleSendTestEmail}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        colleges={colleges}
        onSelectCollege={(c) => setSelectedCollegeModal(c)}
        onNavigate={handleNavigate}
        onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
      />
    </div>
  );
}
