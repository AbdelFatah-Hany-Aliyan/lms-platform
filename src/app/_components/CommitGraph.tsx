"use client";

import { useInView } from "../hooks/useInView";

/**
 * Signature visual: a git-branch-style diagram. A single "foundations"
 * trunk splits into the four LMSPro tracks, then merges back into a
 * single "hired" outcome. Lines draw themselves in and nodes pop in
 * once the graph scrolls into view.
 */
export default function CommitGraph() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  const lineBase =
    "fill-none stroke-[2px] [stroke-linecap:round] [stroke-dasharray:1400] transition-[stroke-dashoffset] duration-[1600ms] [transition-timing-function:cubic-bezier(.16,.84,.44,1)]";
  const dashOffset = inView ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1400]";

  const nodeBase =
    "origin-center transition-all duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)]";
  const nodeState = inView ? "opacity-100 scale-100" : "opacity-0 scale-[0.4]";

  return (
    <div ref={ref} className="border-t border-[#1a1a1a] pt-14">
      <svg
        viewBox="0 0 1160 300"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        role="img"
        aria-label="Diagram of a learning path branching from Foundations into four tracks and merging into Industry Ready"
      >
        {/* main trunk */}
        <path className={`${lineBase} ${dashOffset} stroke-[#3a3a3a]`} d="M 40 150 H 250" />

        {/* branches */}
        <path className={`${lineBase} ${dashOffset} stroke-cobalt`} d="M 250 150 C 320 150 320 40 400 40 H 660" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt`} d="M 250 150 C 320 150 320 110 400 110 H 660" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt`} d="M 250 150 C 320 150 320 190 400 190 H 660" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt`} d="M 250 150 C 320 150 320 260 400 260 H 660" />

        {/* merges */}
        <path className={`${lineBase} ${dashOffset} stroke-cobalt-light`} d="M 660 40 C 740 40 740 150 900 150" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt-light`} d="M 660 110 C 740 110 740 150 900 150" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt-light`} d="M 660 190 C 740 190 740 150 900 150" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt-light`} d="M 660 260 C 740 260 740 150 900 150" />
        <path className={`${lineBase} ${dashOffset} stroke-cobalt-light`} d="M 900 150 H 1120" />

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="40" cy="150" r="7" className="fill-black stroke-[#5a5a5a] stroke-[3px]" />
        </g>
        <text x="40" y="180" textAnchor="middle" className="font-mono text-[12px] fill-slate">
          start
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="250" cy="150" r="7" className="fill-black stroke-[#5a5a5a] stroke-[3px]" />
        </g>
        <text x="250" y="180" textAnchor="middle" className="font-mono text-[12px] fill-slate">
          foundations
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="400" cy="40" r="6.5" className="fill-black stroke-cobalt stroke-[3px]" />
        </g>
        <text x="418" y="45" className="font-mono text-[12px] fill-slate">
          full-stack web
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="400" cy="110" r="6.5" className="fill-black stroke-cobalt stroke-[3px]" />
        </g>
        <text x="418" y="115" className="font-mono text-[12px] fill-slate">
          mobile engineering
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="400" cy="190" r="6.5" className="fill-black stroke-cobalt stroke-[3px]" />
        </g>
        <text x="418" y="195" className="font-mono text-[12px] fill-slate">
          core computer science
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="400" cy="260" r="6.5" className="fill-black stroke-cobalt stroke-[3px]" />
        </g>
        <text x="418" y="265" className="font-mono text-[12px] fill-slate">
          ai / deep learning
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="900" cy="150" r="8" className="fill-cobalt stroke-cobalt-light stroke-[3px]" />
        </g>
        <text x="900" y="130" textAnchor="middle" className="font-mono text-[12px] fill-white font-medium">
          portfolio-ready
        </text>

        <g className={`${nodeBase} ${nodeState}`}>
          <circle cx="1120" cy="150" r="9" className="fill-cobalt stroke-cobalt-light stroke-[3px]" />
        </g>
        <text x="1120" y="130" textAnchor="middle" className="font-mono text-[12px] fill-white font-medium">
          hired
        </text>
      </svg>
    </div>
  );
}
