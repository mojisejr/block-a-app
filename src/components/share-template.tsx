import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ShareTemplateProps {
  mainStat: string;
  subStat?: string;
  details: {
    label: string;
    value: string;
  }[];
  variant?: 'default' | 'tempo' | 'blocka';
  warmUpText?: string;
  coolDownText?: string;
  suggestion?: string;
  intensityDescription?: string;
  title?: string;
}

export const ShareTemplate = forwardRef<HTMLDivElement, ShareTemplateProps>(
  ({ mainStat, subStat, details, variant = 'default', warmUpText, coolDownText, suggestion, intensityDescription, title = "Training Plan" }, ref) => {
    if (variant === 'tempo' || variant === 'blocka') {
      return (
        <div
          ref={ref}
          className="w-[600px] bg-red-50 p-8 font-sans relative overflow-hidden"
          style={{ fontFamily: "'Kanit', sans-serif" }}
        >
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-6">
             {/* Logo Top-Left - Square */}
             <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-sm">
                <img src="/images/logo-red.JPG" alt="Block A Logo" className="h-full w-full object-cover" />
             </div>
             
             {/* Title Right/Center */}
             <div className="flex items-center gap-2">
                <span className="text-red-900 font-bold text-2xl tracking-tight">{title}</span>
             </div>
          </div>

          {/* Main Stat Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 mb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-red-900/60 mb-1">Target</p>
            <div className="text-6xl font-black text-red-600 tracking-tighter mb-2">
              {mainStat}
            </div>
            {subStat && (
               <p className="text-lg text-red-800 font-medium">
                 {subStat}
               </p>
            )}
            {intensityDescription && (
               <p className="text-sm text-red-800 font-medium bg-red-100/50 inline-block px-3 py-1 rounded-full mt-2">
                 {intensityDescription}
               </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {details.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-red-900/60 uppercase font-semibold mb-1">{item.label}</span>
                <span className="text-lg font-bold text-slate-800 leading-tight">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Workout Structure (Only if provided) */}
          {(warmUpText || coolDownText || details.find(d => d.label === 'Main Set')) && (
            <div className="bg-white/80 rounded-xl p-4 border border-red-100 space-y-3 mb-6">
               {warmUpText && (
                 <div className="flex gap-3 items-center">
                    <div className="h-6 w-8 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">WU</div>
                    <div className="text-sm text-slate-700 font-medium">{warmUpText}</div>
                 </div>
               )}
               {details.find(d => d.label === 'Main Set') && (
                 <div className="flex gap-3 items-center">
                    <div className="h-6 w-8 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">MS</div>
                    <div className="text-sm text-slate-900 font-bold">{details.find(d => d.label === 'Main Set')?.value}</div>
                 </div>
               )}
               {coolDownText && (
                 <div className="flex gap-3 items-center">
                    <div className="h-6 w-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">CD</div>
                    <div className="text-sm text-slate-700 font-medium">{coolDownText}</div>
                 </div>
               )}
            </div>
          )}

          {/* Coach Suggestion */}
          {suggestion && (
            <div className="bg-red-100/80 rounded-xl p-4 border border-red-200 flex gap-3 items-start">
               <div className="text-red-500 mt-0.5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0 1.1.2 2.2.5 3.3a9 9 0 0 0 10.9-10.9"/></svg>
               </div>
               <div className="text-xs text-red-900 leading-relaxed">
                 <span className="font-bold block mb-0.5">Coach Suggestion</span>
                 {suggestion}
               </div>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-2 right-4 text-[10px] text-red-900/40 font-medium">
            Generated by Block A
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="w-[600px] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white font-sans relative overflow-hidden"
        style={{ fontFamily: "'Kanit', sans-serif" }} // Ensure font is available or fallback
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col h-full justify-between min-h-[400px]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">S</span>
            </div>
            <span className="text-lg font-medium tracking-wide opacity-90">
              Smart Race Pacer
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-blue-400 text-lg font-medium uppercase tracking-wider">
                ภารกิจซ้อมของฉัน
              </h3>
              <h1 className="text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                {mainStat}
              </h1>
              {subStat && (
                <p className="text-2xl text-slate-300 font-light">{subStat}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
              {details.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 flex justify-between items-end border-t border-white/5">
            <div className="text-xs text-slate-500">
              Generated by Smart Race Pacer
            </div>
            <div className="text-xs text-slate-500">
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareTemplate.displayName = "ShareTemplate";
