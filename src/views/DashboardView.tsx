import React from 'react';
import { SystemStats, ActivityFeedItem, NavScreen, CollegeContact } from '../types';
import { classificationsData, districtsData } from '../data/mockData';

interface DashboardViewProps {
  stats: SystemStats;
  activities: ActivityFeedItem[];
  colleges: CollegeContact[];
  onOpenCampaignModal: () => void;
  onNavigate: (screen: NavScreen, filter?: string) => void;
  onTriggerToast: (msg: string, icon?: string) => void;
  onSelectCollegeByName: (name: string) => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  activities,
  colleges,
  onOpenCampaignModal,
  onNavigate,
  onTriggerToast,
  onSelectCollegeByName,
  onRefreshData
}) => {
  const handleExportCSV = () => {
    // Generate simple CSV payload of colleges
    const headers = ['Name', 'District', 'Zone', 'Category', 'AISHE', 'Principal', 'Email', 'Status'];
    const rows = colleges.map(c => [
      `"${c.name}"`,
      `"${c.district}"`,
      `"${c.zone}"`,
      `"${c.category}"`,
      `"${c.aisheCode}"`,
      `"${c.principalName}"`,
      `"${c.principalEmail}"`,
      `"${c.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'TN_Institutions_Roster_2024.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast('Export initiated: Generating TN_Institutions_Roster_2024.csv', 'download');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Demo Notice Banner */}
      <div className="mb-space-md bg-secondary-fixed/50 px-space-md py-space-sm rounded-lg flex items-center justify-between shadow-sm border border-[#bec6e0]/40">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-[20px] text-on-secondary-fixed">shield_lock</span>
          <div className="flex items-baseline gap-space-xs flex-wrap">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-secondary-fixed font-bold">
              Demo Mode Active
            </span>
            <span className="text-secondary">—</span>
            <span className="font-body-sm text-body-sm text-on-secondary-fixed">
              No live Gmail or Google Sheets connected. Displaying synthetic Tamil Nadu institutional directory metrics.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-code-sm bg-surface-container-lowest text-secondary font-medium border border-[#cbd5e1]/40">
            AY 2024-25 v1.4
          </span>
          <button
            className="text-secondary hover:text-on-surface p-1 rounded transition-colors"
            onClick={() => {
              onRefreshData();
              onTriggerToast('Synchronizing mock state with local sandbox ledger...', 'sync');
            }}
            title="Sync Sandbox"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-bold">
              Regional Directorate
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-code-sm text-code-sm text-secondary">
              T.N. Directorate of Collegiate Outreach
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Welcome back, Karthik
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-0.5">
            Tamil Nadu Higher Education Outreach Overview — Academic Year 2024–25
          </p>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            className="h-9 px-space-md rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-all shadow-sm border border-[#e2e8f0] flex items-center gap-space-xs font-label-lg text-label-lg font-semibold active:scale-[0.98] cursor-pointer"
            onClick={handleExportCSV}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            className="h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:opacity-95 transition-all shadow-sm flex items-center gap-space-xs font-label-lg text-label-lg font-semibold active:scale-[0.98] cursor-pointer"
            onClick={onOpenCampaignModal}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* 6-Metric Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md mb-space-lg">
        {/* Card 1: Total Colleges */}
        <div 
          onClick={() => onNavigate('college-contacts')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Total Colleges</span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              {stats.totalColleges.toLocaleString()}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">38 Districts across Tamil Nadu</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">
              <span className="material-symbols-outlined text-[13px] text-primary">trending_up</span> +24 this wk
            </span>
            <span className="font-code-sm text-code-sm text-secondary">100% AISHE</span>
          </div>
        </div>

        {/* Card 2: Verified Records */}
        <div 
          onClick={() => onNavigate('college-contacts', 'verified')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Verified Records</span>
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              {stats.verifiedRecords.toLocaleString()}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">79.6% deliverability certified</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-tertiary font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 98.2% valid
            </span>
            <span className="font-code-sm text-code-sm text-secondary">MX valid</span>
          </div>
        </div>

        {/* Card 3: Pending Queued */}
        <div 
          onClick={() => onNavigate('college-contacts', 'pending')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Pending Queue</span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              {stats.pendingQueue}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">Awaiting review & enrichment</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
              <span className="material-symbols-outlined text-[13px]">schedule</span> Batch 4 ready
            </span>
            <span className="font-code-sm text-code-sm text-secondary">12.4%</span>
          </div>
        </div>

        {/* Card 4: Dispatched Sent */}
        <div 
          onClick={() => onNavigate('send-history')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Dispatched</span>
              <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed group-hover:bg-tertiary-container group-hover:text-on-tertiary-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              {stats.dispatched}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">Total academic dispatches</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
              <span className="material-symbols-outlined text-[13px]">campaign</span> 4 waves
            </span>
            <span className="font-code-sm text-code-sm text-secondary">56.8% reach</span>
          </div>
        </div>

        {/* Card 5: Failed Bounces */}
        <div 
          onClick={() => onNavigate('college-contacts', 'bounced')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Bounced / Failed</span>
              <div className="w-7 h-7 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
                <span className="material-symbols-outlined text-[18px]">error</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-error tracking-tight font-bold">
              {stats.bouncedFailed}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">Mailbox unavailable or full</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
              2.5% rate
            </span>
            <span className="font-code-sm text-code-sm text-secondary">Sub-3% SLA</span>
          </div>
        </div>

        {/* Card 6: Cleaned Duplicates */}
        <div 
          onClick={() => onNavigate('import-contacts')}
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e2e8f0] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">Deduplicated</span>
              <div className="w-7 h-7 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              </div>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              {stats.deduplicated}
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-1">Purged across campus rosters</p>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">
              Cleaned
            </span>
            <span className="font-code-sm text-code-sm text-secondary">5.4% scrub</span>
          </div>
        </div>
      </div>

      {/* Primary Analytic & Activity Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg items-start">
        {/* Left Column: Status Breakdown & Regional Coverage (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Card: Delivery & Health Distribution */}
          <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Campaign Delivery &amp; Status Breakdown
                </h2>
                <span className="font-body-sm text-body-sm text-secondary">
                  Active ledger segmentation for Tamil Nadu institutional database
                </span>
              </div>
              <span className="font-code-sm text-code-sm bg-surface-container px-2 py-1 rounded text-secondary font-medium">
                1,482 TOTAL
              </span>
            </div>

            {/* Multi-segment visual progress bar */}
            <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden flex mb-space-sm">
              <div className="bg-primary-container h-full transition-all" style={{ width: '79.6%' }} title="Verified: 79.6%"></div>
              <div className="bg-surface-dim h-full transition-all" style={{ width: '12.4%' }} title="Pending: 12.4%"></div>
              <div className="bg-error h-full transition-all" style={{ width: '2.5%' }} title="Failed: 2.5%"></div>
              <div className="bg-secondary h-full transition-all" style={{ width: '5.5%' }} title="Duplicates: 5.5%"></div>
            </div>

            {/* Legend Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs mb-space-md">
              <div 
                onClick={() => onNavigate('college-contacts', 'verified')}
                className="flex flex-col p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Verified</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">1,180</span>
                <span className="font-code-sm text-code-sm text-secondary">79.6%</span>
              </div>

              <div 
                onClick={() => onNavigate('college-contacts', 'pending')}
                className="flex flex-col p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-surface-dim"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Pending</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">184</span>
                <span className="font-code-sm text-code-sm text-secondary">12.4%</span>
              </div>

              <div 
                onClick={() => onNavigate('college-contacts', 'bounced')}
                className="flex flex-col p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-error"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Bounced</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-error font-bold">38</span>
                <span className="font-code-sm text-code-sm text-secondary">2.5%</span>
              </div>

              <div 
                onClick={() => onNavigate('import-contacts')}
                className="flex flex-col p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Duplicates</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">80</span>
                <span className="font-code-sm text-code-sm text-secondary">5.5%</span>
              </div>
            </div>

            {/* Inline Visual Chart: Category Matrix */}
            <div className="pt-space-sm bg-surface-container-low/50 p-space-md rounded-lg border border-[#e2e8f0]/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Institutional Classifications</span>
                <span className="font-label-sm text-label-sm text-secondary">AICTE / UGC / DOTE Matrix</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {classificationsData.map((cls) => (
                  <div 
                    key={cls.name}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onNavigate('college-contacts', cls.name)}
                  >
                    <span className="font-label-sm text-label-sm text-secondary block truncate">{cls.name}</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{cls.count}</span>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`${cls.color} h-full rounded-full`} style={{ width: `${cls.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District Coverage Summary Module */}
          <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Top District Density</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Major educational clusters in the Tamil Nadu corridor</p>
                </div>
              </div>
              <button
                className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                onClick={() => onNavigate('college-contacts')}
              >
                <span>View All 38</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              {districtsData.slice(0, 6).map((dist) => (
                <div 
                  key={dist.name} 
                  className="flex flex-col gap-1 cursor-pointer group"
                  onClick={() => onNavigate('college-contacts', dist.name.replace(' District', ''))}
                >
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dist.color}`}></span>
                      <span className="font-medium text-on-surface group-hover:text-primary transition-colors">
                        {dist.name}
                      </span>
                      <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.2 rounded text-[11px]">
                        {dist.zone}
                      </span>
                    </div>
                    <span className="font-semibold text-on-surface">
                      {dist.count} <span className="font-normal text-secondary">colleges</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className={`${dist.color} h-2 rounded-full transition-all group-hover:opacity-85`} style={{ width: `${dist.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between flex-wrap gap-2 border border-[#e2e8f0]/60">
              <span className="font-body-sm text-body-sm text-secondary">Regional Affiliation Coverage:</span>
              <span className="font-code-sm text-code-sm font-semibold text-on-surface text-[12px]">
                Anna Univ: 412 | Univ of Madras: 218 | Bharathiar: 142
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Outreach Activity Stream (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recent Outreach Activity</h2>
                <p className="font-body-sm text-body-sm text-secondary">Real-time mock dispatch events &amp; ledger checks</p>
              </div>
              <span className="inline-flex items-center gap-1 font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> LIVE FEED
              </span>
            </div>

            {/* Activity Feed List */}
            <div className="flex flex-col gap-space-sm">
              {activities.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCollegeByName(item.collegeName)}
                  className="p-space-sm rounded-lg bg-surface-container-low/40 hover:bg-surface-container-low transition-colors flex items-start gap-space-sm cursor-pointer border border-transparent hover:border-[#e2e8f0]"
                >
                  <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`material-symbols-outlined text-[18px] ${item.iconColor}`}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        {item.collegeName}
                      </span>
                      <span className="font-code-sm text-code-sm text-secondary shrink-0 text-[11px]">
                        {item.timeAgo}
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-secondary truncate">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        item.statusType === 'verified' 
                          ? 'bg-surface-container-highest text-tertiary' 
                          : item.statusType === 'pending'
                          ? 'bg-surface-container text-secondary'
                          : item.statusType === 'sent'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : item.statusType === 'duplicate'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-error-container text-on-error-container'
                      }`}>
                        {item.statusBadge}
                      </span>
                      <span className="font-code-sm text-code-sm text-secondary text-[11px] truncate">
                        {item.subBadge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#e2e8f0]"
              onClick={() => onNavigate('send-history')}
            >
              <span>View Detailed Send Audit History</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Quick Campaign Dispatch Readiness Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm font-semibold uppercase text-secondary">
                Dispatcher Velocity Throttle
              </span>
              <span className="font-code-sm text-code-sm text-primary font-bold">
                {stats.velocityThrottle} msgs/min
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mb-3">
              Rate limiting safeguards active to protect IP reputation across .edu.in and .ac.in institutional recipient servers.
            </p>
            <div className="flex items-center justify-between bg-surface-container-low p-2 rounded text-[12px] border border-[#e2e8f0]/60">
              <span className="text-secondary font-medium">Compliance Check:</span>
              <span className="text-on-surface font-semibold">UGC / AICTE Outreach Protocol 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Integration Health Cards & System Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Integration 1: Google Sheets */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between border border-[#e2e8f0]">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[24px]">table_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface">Google Sheets Sync</span>
                <span className="bg-surface-container text-secondary px-2 py-0.5 rounded text-[11px] font-semibold">
                  Mock Provider
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                Institutional master roster auto-import disconnected
              </p>
            </div>
          </div>
          <button
            className="font-label-md text-label-md text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            onClick={() => onNavigate('settings')}
          >
            <span>Configure</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>

        {/* Integration 2: Gmail SMTP API */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between border border-[#e2e8f0]">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[24px]">mail</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface">Gmail API Gateway</span>
                <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[11px] font-semibold">
                  Sandbox Active
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                Zero real emails will be transmitted in this environment
              </p>
            </div>
          </div>
          <button
            className="font-label-md text-label-md text-secondary hover:text-on-surface font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            onClick={() => onTriggerToast('Sandbox mode is active. Dispatches generate simulated audit records without external mail transmission.', 'lock')}
          >
            <span>Sandbox Info</span>
            <span className="material-symbols-outlined text-[16px]">info</span>
          </button>
        </div>
      </div>
    </div>
  );
};
