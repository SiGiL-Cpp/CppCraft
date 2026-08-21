---
title: "05 — Processing"
prev: "04-aggregates"
next: "06-tbd"
---

# 05 - Processing

Allow me to take you on a journey to an alchemy lab. Maybe we get there by
scrambling down very steep stairs that cling to a bathhouse wall, overhanging a
misty chasm.

Don't worry, there is a point to this. I want to introduce you to a model of the
processor and its surroundings. It will be very helpful for understanding
several tricky aspects of C++ that would otherwise look like arbitrary rules.

## CPU

As a master alchemist (a programmer), you rarely enter the lab yourself.
Instead, you send your apprentice. The poor soul is very obedient and follows
all your instructions by the letter, but is somewhat lacking in judgement. You
give them some scrolls with all the instructions (the compiled code), and they
scrupulously go through them. If the instruction tells to set fire to a black
powder keg, they'll do it without a second thought.

Yet, this apprentice of yours (the *CPU*) is your arms and hands in the
laboratory.

## Memory

The workshop has a large wall of drawers (the *RAM*). Millions of drawers. Each
drawer lies in its slot on the wall, and each slot has a number etched on its
bottom shelf. Under the top left drawer the number #1 is etched. Under the
drawer next to the number #2, under the one after #3, and so on across the whole
wall.

<svg viewBox="10 10 596 753.549" width="100%">
  <g transform="matrix(1, 0, 0, 1, -126.95901489257812, -218.61500549316406)" id="object-0">
    <rect x="136.959" y="292.1" width="594.957" height="689" fill="var(--recap, #1e1e2e)" stroke="var(--recap-border, #3a3a5a)" stroke-width="2" style="stroke-width: 2px;"/>
    <rect x="136.959" y="228.615" width="594.957" height="72" rx="6" fill="var(--recap, #1e1e2e)" stroke="var(--recap-border, #3a3a5a)" stroke-width="2" style="stroke-width: 2px;"/>
    <text x="434.437" y="268.805" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--recap-label, #8888cc)" style="white-space: pre; stroke-width: 1px;">The Wall of Drawers</text>
    <g>
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, 0, 88)">
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n+1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n+2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n+3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n+4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#n+5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, 0, 176)">
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n+1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n+2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n+3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n+4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#2n+5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#3n</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, 0, 417)">
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#x+n</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, 0, 505)">
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#y+n</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, 0, 593)">
      <g transform="matrix(1, 0, 0, 1, -71.922981, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, -6.922993, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 58.077007, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 123.077019, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 188.077011, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <g transform="matrix(1, 0, 0, 1, 453.077026, -210.89299)">
        <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      </g>
      <text x="171.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+1</text>
      <text x="236.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+2</text>
      <text x="301.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+3</text>
      <text x="366.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+4</text>
      <text x="431.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+5</text>
      <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="466.959" y1="336.115" x2="660.959" y2="336.115"/>
      <text x="696.959" y="380.387" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text, #cdd4e0)" style="white-space: pre; stroke-width: 1px;">#z+n</text>
    </g>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 331.139 H 180.827 A 4 4 0 0 1 184.827 335.139 V 340.091 A 0 0 0 0 1 184.827 340.091 H 159.091 A 0 0 0 0 1 159.091 340.091 V 335.139 A 4 4 0 0 1 163.091 331.139 Z" bx:shape="rect 159.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@941c1056"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 331.139 H 245.827 A 4 4 0 0 1 249.827 335.139 V 340.091 A 0 0 0 0 1 249.827 340.091 H 224.091 A 0 0 0 0 1 224.091 340.091 V 335.139 A 4 4 0 0 1 228.091 331.139 Z" bx:shape="rect 224.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@640e09b3"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 331.139 H 310.827 A 4 4 0 0 1 314.827 335.139 V 340.091 A 0 0 0 0 1 314.827 340.091 H 289.091 A 0 0 0 0 1 289.091 340.091 V 335.139 A 4 4 0 0 1 293.091 331.139 Z" bx:shape="rect 289.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@087e6711"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 331.139 H 375.827 A 4 4 0 0 1 379.827 335.139 V 340.091 A 0 0 0 0 1 379.827 340.091 H 354.091 A 0 0 0 0 1 354.091 340.091 V 335.139 A 4 4 0 0 1 358.091 331.139 Z" bx:shape="rect 354.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@73df6263"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 331.139 H 440.827 A 4 4 0 0 1 444.827 335.139 V 340.091 A 0 0 0 0 1 444.827 340.091 H 419.091 A 0 0 0 0 1 419.091 340.091 V 335.139 A 4 4 0 0 1 423.091 331.139 Z" bx:shape="rect 419.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@df066090"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 331.139 H 705.827 A 4 4 0 0 1 709.827 335.139 V 340.091 A 0 0 0 0 1 709.827 340.091 H 684.091 A 0 0 0 0 1 684.091 340.091 V 335.139 A 4 4 0 0 1 688.091 331.139 Z" bx:shape="rect 684.091 331.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@e6043e56"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 507.139 H 180.827 A 4 4 0 0 1 184.827 511.139 V 516.091 A 0 0 0 0 1 184.827 516.091 H 159.091 A 0 0 0 0 1 159.091 516.091 V 511.139 A 4 4 0 0 1 163.091 507.139 Z" bx:shape="rect 159.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@2e1aa4ae"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 507.139 H 245.827 A 4 4 0 0 1 249.827 511.139 V 516.091 A 0 0 0 0 1 249.827 516.091 H 224.091 A 0 0 0 0 1 224.091 516.091 V 511.139 A 4 4 0 0 1 228.091 507.139 Z" bx:shape="rect 224.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@9f4ad543"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 507.139 H 310.827 A 4 4 0 0 1 314.827 511.139 V 516.091 A 0 0 0 0 1 314.827 516.091 H 289.091 A 0 0 0 0 1 289.091 516.091 V 511.139 A 4 4 0 0 1 293.091 507.139 Z" bx:shape="rect 289.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@53b68e41"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 507.139 H 375.827 A 4 4 0 0 1 379.827 511.139 V 516.091 A 0 0 0 0 1 379.827 516.091 H 354.091 A 0 0 0 0 1 354.091 516.091 V 511.139 A 4 4 0 0 1 358.091 507.139 Z" bx:shape="rect 354.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@eac59d93"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 507.139 H 440.827 A 4 4 0 0 1 444.827 511.139 V 516.091 A 0 0 0 0 1 444.827 516.091 H 419.091 A 0 0 0 0 1 419.091 516.091 V 511.139 A 4 4 0 0 1 423.091 507.139 Z" bx:shape="rect 419.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@c05f2380"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 507.139 H 705.827 A 4 4 0 0 1 709.827 511.139 V 516.091 A 0 0 0 0 1 709.827 516.091 H 684.091 A 0 0 0 0 1 684.091 516.091 V 511.139 A 4 4 0 0 1 688.091 507.139 Z" bx:shape="rect 684.091 507.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@591cf3aa"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 419.139 H 180.827 A 4 4 0 0 1 184.827 423.139 V 428.091 A 0 0 0 0 1 184.827 428.091 H 159.091 A 0 0 0 0 1 159.091 428.091 V 423.139 A 4 4 0 0 1 163.091 419.139 Z" bx:shape="rect 159.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@c940290c"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 419.139 H 245.827 A 4 4 0 0 1 249.827 423.139 V 428.091 A 0 0 0 0 1 249.827 428.091 H 224.091 A 0 0 0 0 1 224.091 428.091 V 423.139 A 4 4 0 0 1 228.091 419.139 Z" bx:shape="rect 224.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@15678f41"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 419.139 H 310.827 A 4 4 0 0 1 314.827 423.139 V 428.091 A 0 0 0 0 1 314.827 428.091 H 289.091 A 0 0 0 0 1 289.091 428.091 V 423.139 A 4 4 0 0 1 293.091 419.139 Z" bx:shape="rect 289.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@29ddf1db"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 419.139 H 375.827 A 4 4 0 0 1 379.827 423.139 V 428.091 A 0 0 0 0 1 379.827 428.091 H 354.091 A 0 0 0 0 1 354.091 428.091 V 423.139 A 4 4 0 0 1 358.091 419.139 Z" bx:shape="rect 354.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@917018e1"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 419.139 H 440.827 A 4 4 0 0 1 444.827 423.139 V 428.091 A 0 0 0 0 1 444.827 428.091 H 419.091 A 0 0 0 0 1 419.091 428.091 V 423.139 A 4 4 0 0 1 423.091 419.139 Z" bx:shape="rect 419.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@75e98b7a"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 419.139 H 705.827 A 4 4 0 0 1 709.827 423.139 V 428.091 A 0 0 0 0 1 709.827 428.091 H 684.091 A 0 0 0 0 1 684.091 428.091 V 423.139 A 4 4 0 0 1 688.091 419.139 Z" bx:shape="rect 684.091 419.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@fa6a790c"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 749.139 H 180.827 A 4 4 0 0 1 184.827 753.139 V 758.091 A 0 0 0 0 1 184.827 758.091 H 159.091 A 0 0 0 0 1 159.091 758.091 V 753.139 A 4 4 0 0 1 163.091 749.139 Z" bx:shape="rect 159.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@922f5b32"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 749.139 H 245.827 A 4 4 0 0 1 249.827 753.139 V 758.091 A 0 0 0 0 1 249.827 758.091 H 224.091 A 0 0 0 0 1 224.091 758.091 V 753.139 A 4 4 0 0 1 228.091 749.139 Z" bx:shape="rect 224.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@4394feb7"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 749.139 H 310.827 A 4 4 0 0 1 314.827 753.139 V 758.091 A 0 0 0 0 1 314.827 758.091 H 289.091 A 0 0 0 0 1 289.091 758.091 V 753.139 A 4 4 0 0 1 293.091 749.139 Z" bx:shape="rect 289.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@fe5932ed"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 749.139 H 375.827 A 4 4 0 0 1 379.827 753.139 V 758.091 A 0 0 0 0 1 379.827 758.091 H 354.091 A 0 0 0 0 1 354.091 758.091 V 753.139 A 4 4 0 0 1 358.091 749.139 Z" bx:shape="rect 354.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@e2fa97a7"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 749.139 H 440.827 A 4 4 0 0 1 444.827 753.139 V 758.091 A 0 0 0 0 1 444.827 758.091 H 419.091 A 0 0 0 0 1 419.091 758.091 V 753.139 A 4 4 0 0 1 423.091 749.139 Z" bx:shape="rect 419.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@92d076ec"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 749.139 H 705.827 A 4 4 0 0 1 709.827 753.139 V 758.091 A 0 0 0 0 1 709.827 758.091 H 684.091 A 0 0 0 0 1 684.091 758.091 V 753.139 A 4 4 0 0 1 688.091 749.139 Z" bx:shape="rect 684.091 749.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@77bc321e"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 925.139 H 180.827 A 4 4 0 0 1 184.827 929.139 V 934.091 A 0 0 0 0 1 184.827 934.091 H 159.091 A 0 0 0 0 1 159.091 934.091 V 929.139 A 4 4 0 0 1 163.091 925.139 Z" bx:shape="rect 159.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@ca5a8716"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 925.139 H 245.827 A 4 4 0 0 1 249.827 929.139 V 934.091 A 0 0 0 0 1 249.827 934.091 H 224.091 A 0 0 0 0 1 224.091 934.091 V 929.139 A 4 4 0 0 1 228.091 925.139 Z" bx:shape="rect 224.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@26fd2c9b"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 925.139 H 310.827 A 4 4 0 0 1 314.827 929.139 V 934.091 A 0 0 0 0 1 314.827 934.091 H 289.091 A 0 0 0 0 1 289.091 934.091 V 929.139 A 4 4 0 0 1 293.091 925.139 Z" bx:shape="rect 289.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@c1fd2c55"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 925.139 H 375.827 A 4 4 0 0 1 379.827 929.139 V 934.091 A 0 0 0 0 1 379.827 934.091 H 354.091 A 0 0 0 0 1 354.091 934.091 V 929.139 A 4 4 0 0 1 358.091 925.139 Z" bx:shape="rect 354.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@f10ce6c3"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 925.139 H 440.827 A 4 4 0 0 1 444.827 929.139 V 934.091 A 0 0 0 0 1 444.827 934.091 H 419.091 A 0 0 0 0 1 419.091 934.091 V 929.139 A 4 4 0 0 1 423.091 925.139 Z" bx:shape="rect 419.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@f5d1f2fc"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 925.139 H 705.827 A 4 4 0 0 1 709.827 929.139 V 934.091 A 0 0 0 0 1 709.827 934.091 H 684.091 A 0 0 0 0 1 684.091 934.091 V 929.139 A 4 4 0 0 1 688.091 925.139 Z" bx:shape="rect 684.091 925.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@aa951d02"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 163.091 837.139 H 180.827 A 4 4 0 0 1 184.827 841.139 V 846.091 A 0 0 0 0 1 184.827 846.091 H 159.091 A 0 0 0 0 1 159.091 846.091 V 841.139 A 4 4 0 0 1 163.091 837.139 Z" bx:shape="rect 159.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@09fca8d4"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 228.091 837.139 H 245.827 A 4 4 0 0 1 249.827 841.139 V 846.091 A 0 0 0 0 1 249.827 846.091 H 224.091 A 0 0 0 0 1 224.091 846.091 V 841.139 A 4 4 0 0 1 228.091 837.139 Z" bx:shape="rect 224.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@ef0d0ad5"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 293.091 837.139 H 310.827 A 4 4 0 0 1 314.827 841.139 V 846.091 A 0 0 0 0 1 314.827 846.091 H 289.091 A 0 0 0 0 1 289.091 846.091 V 841.139 A 4 4 0 0 1 293.091 837.139 Z" bx:shape="rect 289.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@50a5e0cf"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 358.091 837.139 H 375.827 A 4 4 0 0 1 379.827 841.139 V 846.091 A 0 0 0 0 1 379.827 846.091 H 354.091 A 0 0 0 0 1 354.091 846.091 V 841.139 A 4 4 0 0 1 358.091 837.139 Z" bx:shape="rect 354.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@735c491d"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 423.091 837.139 H 440.827 A 4 4 0 0 1 444.827 841.139 V 846.091 A 0 0 0 0 1 444.827 846.091 H 419.091 A 0 0 0 0 1 419.091 846.091 V 841.139 A 4 4 0 0 1 423.091 837.139 Z" bx:shape="rect 419.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@f50ab7ea"/>
    <path style="fill: var(--aside-border, #2e4e7a);" d="M 688.091 837.139 H 705.827 A 4 4 0 0 1 709.827 841.139 V 846.091 A 0 0 0 0 1 709.827 846.091 H 684.091 A 0 0 0 0 1 684.091 846.091 V 841.139 A 4 4 0 0 1 688.091 837.139 Z" bx:shape="rect 684.091 837.139 25.736 8.952 0 4 4 0 4 4 0 0 0 0 0 0 2@07a28c5c"/>
  </g>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="570" y1="347" x2="570" y2="497"/>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="45" y1="347" x2="45" y2="497" transform="matrix(1.00000006, 0, 0, 1, -0.00000388, 0)"/>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="110" y1="347" x2="110" y2="497"/>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="175" y1="347" x2="175" y2="497"/>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="240" y1="347" x2="240" y2="497"/>
  <line style="fill: none; stroke-dasharray: 8px; stroke: var(--aside-border, #2e4e7a);" x1="305" y1="347" x2="305" y2="497"/>
</svg>

### Memory pages

Inside each drawer, there are little boxes. Typically:
- A drawer contains 64 (8&times;8) boxes with high sides.
- Each of these box is divided in two by a separator that goes only a third of
  the way up the box.
- And each side of the separator is also divided in two by an even lower
  separator.
- This subdivision continues with lower and lower separators four more times.

This separating system allows to store many small ingredients in the shallow
tight grid at the bottom of a box, or only one very large ingredients at the top
of the box, or an intermediate number of medium ingredients at the intermediate
levels, or even a mix medium and small ingredients. The important part is that
each ingredient (*data*) can be stored isolated from other ingredients.

### Process Memory Layout

When the apprentice enters the workshop, some of the bottom drawers are directly
available.
- The bottom rows to store the scrolls where the instructions are
written (the *compiled code*), so that it's easy to find them when needed.
- A few more rows of drawers above these to store the ingredients the apprentice
  came with (*static data*).
- And plenty more rows of empty drawers for the apprentice to work with.

But all the drawers of the middle and top rows are locked. If the apprentice
needs more drawer space to work with than the bottom rows, they have to ask the
butler who will give them a key, with a label on it indicating which drawers
have been made available for them.

There is also a lot of stuff stored in the cellar (the *drive memory*), a
market in the nearby town (networking) and other sources of ingredients, but
that all requires asking the butler (the *Operating System*) and takes time to
bring over.

## Registers

Opposite the wall of drawer is the desk where the apprentice works, grinding,
mincing, crushing, mixing the ingredients into potions or new ingredients.

These operations happen in special stone vessels (*registers*) that are
structures like the boxes in the drawers: a high rim around, a lower separator,
and lower and lower subdivisions all the way down.

There's at least two different kind of such vessels, and at least 16 of each
kind. This varies depending on the alchemy workshop (hardware architecture).

There is also a slate and chalk in a corner of the desk (the *instruction
register*).

## L-Caches

Right next to the desk there are a handful of containers labeled "L1". About a
meter away there are a few dozen containers of the same size with the label
"L2", and a couple meters further away, a full cabinet of them, hundreds, with
the label "L3".

These containers are magical devices, you can't really control them. But every
time your apprentice passes by them, they magically copy whatever is in your
apprentice's hands into one of the container. It is most convenient for staging
the ingredients the apprentice will use the most.
- Only a few can be put in the L1-labeled containers, but they can be grabbed
  without moving from the desk.
- There are more of the L2-labeled containers, but the apprentice has to step
  out of their chair to reach them.
- Finally, the L3 cabinet has plenty of containers, and is still faster to
  access than crossing the whole room to reach the wall of drawers, but it is
  shared with other apprentices.

<svg viewBox="0 0 615 727" width="100%">
  <g transform="matrix(1, 0, 0, 1, 227.153656, 0)">
    <g transform="matrix(1, 0, 0, 1, 5.719337, 222.044006)">
      <rect x="4.627" y="422.956" width="140" height="72" rx="6" fill="var(--illus, #1a3a2a)" stroke="var(--illus-border, #2e6e4e)" stroke-width="2" style="stroke-width: 2px;"/>
      <text x="74.627" y="463.22" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--illus-label, #5dba8a)" style="white-space: pre; stroke-width: 1px;">Desk</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, -93.646667, 93.492325)">
      <rect x="213.882" y="516.508" width="30" height="30" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      <text x="228.882" y="535.732" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--aside-label, #5a9ade)" style="white-space: pre; stroke-width: 1px;">L1</text>
    </g>
    <g transform="matrix(1, 0, 0, 1, -163.514084, -21.507994)">
      <rect x="213.882" y="516.508" width="60" height="60" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
      <text x="243.882" y="550.717" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--aside-label, #5a9ade)" style="white-space: pre; stroke-width: 1px;" transform="matrix(1, 0, 0, 1, 0.000008, -5.552795)">L2<tspan x="243.8820037841797" dy="1em">​</tspan>Cache</text>
    </g>
  </g>
  <g transform="matrix(1, 0, 0, 1, -126.959015, -218.615005)" id="object-0">
    <rect x="136.959" y="228.615" width="594.957" height="72" rx="6" fill="var(--recap, #1e1e2e)" stroke="var(--recap-border, #3a3a5a)" stroke-width="2" style="stroke-width: 2px;"/>
    <text x="434.437" y="268.853" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--recap-label, #8888cc)" style="white-space: pre; stroke-width: 1px;" transform="matrix(1, 0, 0, 1, 0, -5.581062)">The Wall of Drawers<tspan x="434.43701171875" dy="1em">​</tspan>(virtual memory)</text>
  </g>
  <g transform="matrix(1, 0, 0, 1, 33.596439, -241.507996)">
    <rect x="213.882" y="516.508" width="120" height="120" rx="6" fill="var(--aside, #1a2a3a)" stroke="var(--aside-border, #2e4e7a)" stroke-width="2" style="stroke-width: 2px;"/>
    <text x="243.882" y="550.717" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--aside-label, #5a9ade)" style="white-space: pre; stroke-width: 1px;" transform="matrix(1, 0, 0, 1, 30.000015, 24.629314)">L3<tspan x="243.8820037841797" dy="1em">​</tspan>Cabinet</text>
  </g>
</svg>

## A typical day in an apprentice alchemist life

Let us look at what a good day's work looks like for your apprentice.

### Setting up for work

Arriving in the room, your apprentice places the scrolls with the instructions
you have given them in the first drawers near the entry. He also hands over a
specific scroll to the butler instructing them to place the ingredients they
brought in the freely available drawers at the bottom, next to where they have
placed the scrolls.

They pull a drawer off the wall and leave it out for later (the *stack frame*).

Then they reach for the first scroll of instructions.

### Starting the work

#### Reading instructions

Since your apprentice cannot memorize the full set of scrolls (there's an awful
lot of them, and well, you know that apprentice has their own challenges), they
start by picking the first one, carefully copy sixteen or so instructions, and
walk to the desk.

The magical L-containers (*CPU-cache* or *L-cache*) create a copy of the
apprentice's notes as they pass by. One copy lands in a container labeled "L3"
first, then one in a container labeled "L2", and finally one in a container
labeled "L1".

Once at the desk, the apprentice writes only the very first instruction on the
slate. They also keep a note of where they're at in the instructions (the
*program counter*).

Since the note they brought from the wall of drawers is only a copy, they toss
it into the furnace.

#### Memory roundtrip

Then your apprentice starts obeying that first instruction. Typically, the
instruction indicates a specific ingredient in a specific box inside of a
specific drawer. So the apprentice returns to the wall of drawers, opens the
indicated drawer, picks the indicated box in there.

Well, actually, the apprentice magically duplicates that box with its content.
The real thing remains in the drawer. They then walk back to the desk with that
copy in hand.

On the way, the magical cache containers copy the box content in one container.
One copy in a L3 container, one in a L2, one in a L1. We have now 5 copies of
that box: the original in the drawer, the copy on the desk, and 3 copies in the
L-cache containers.

At the desk, the apprentice places the box over one of the stone vessel, and
opens a special trap door below the ingredients the instruction specified.

And toss the box in the furnace.

#### Second instruction and memory roundtrip

It is now time to move to the second instruction. You might remember that the
apprentice had only written the very first instruction on the slate. So they
need to fetch the next instruction.

That would be troublesome if they had to return all the way to the wall of
drawers, but thankfully, the magical L-cache containers made a copy of the whole
note. So without leaving the desk, the apprentice can grab that copy, read the
next instruction from there, and update the slate with it (the new instruction
and the program counter).

The new instruction requires another ingredient. There are two cases:
- If we're unlucky, the apprentice has to return to the wall, grab the box in
  the drawer, come back with a copy of it (*cache miss*).
- But if we're lucky, that other ingredient was in the same box as the first, in
  which case, there will be a copy of it in the L1 cache, reachable from the
  desk (*cache hit*).

Either way, we have now two ingredients at the desk. Maybe in two subdivisions
of the same stone vessel, maybe in two different stone vessels. That depends on
the kind of ingredient it is.

#### Operation

The apprentice reaches for the next instruction from the L1 cache, and updates
the slate.

That instruction says they have to mix the two ingredients in a certain way. And
so they do that. The result of the mix ends up where one of the two ingredients
was before.

#### Memory write

Next instruction (grabbed from the L1 cache, slate updated).

Suppose it tells the apprentice what to do with the mix (a new composite
ingredient for later). Maybe, it tells the apprentice to place it in a specific
subdivision in the specific box of that drawer we kept pulled out of its slot,
the *stack* drawer.

Well, the apprentice could bring the mix to the drawer and dump it in the box
there, but modern alchemy schools teach apprentices to do it a different way.

```aside> How modern architectures return new values into memory
It goes like this:
- The apprentice goes to the wall of drawer and grabs a copy of the target box
  inside the destination drawer.
- They come back with the box copy (the cache containers copy the box as they
  pass by).
- And the apprentice tosses the box right into the furnace.

Yup. Just like that. No mistake here, the apprentice brought the box just to
throw it into the furnace. But there's a trick. The apprentice brought it there
just so that it's in the L1 cache.

They now scoop the mix from the stone vessel (the register) and dump it into
the L1-cache copy. Then they flip a little glowing flag on the copy that reads
"DIRTY".

Of course, if the destination already had a copy inside the L1 cache, the
apprentice would only have turned and flung the mix in there directly from their
chair without walking all the way to grab the box. And that's exactly the reason
for doing it this way: next time the apprentice wants to place an ingredient in
there it'll be right next to them in the L1 cache.

In the past, apprentices would have walked to the wall to place the ingredient,
but then they would have to go back and forth for every "write" operation.

If you wonder about the "DIRTY" glowing flag, that's kind of important. If you
remember, there are only a handful of containers at L1 level. So eventually,
we'll have to free one to copy the new boxes passing by.
- If that flag is down, we can just throw it away in the furnace.
- But if the flag is raised, it's the only place we have the mix the apprentice
  just made, we should not throw it away.
  - What do we do then? We copy the box back into the L2 cache, and switch the
    L2 cache "DIRTY" flag up.
  - The L2 cache has more containers, so it'll keep it a while, but eventually,
    it will also run out.
  - And we then copy that box back to the L3 cache, with its dirty flag up.
  - Finally, when the L3 cache wants to free the container, we write it back to
    the actual drawer.

All this cascade of smaller operations saves a lot of longer back and forth to
the wall.
```

### The stack

The apprentice has very limited space on the desk, so whenever we end up with
somethng we want to keep around, we need to take it back to a drawer.

You remember that most of the drawers are locked and the apprentice would have
to ask the butler for a key to use them. That's rather annoying. So instead, we
use that drawer the apprentice has pulled of its slot at the start.

Whenever we have something we want to keep around, we'll place it in a box of
that drawer.

From the start we have a few of these drawers available for this usage (250-2000
of them), so there is a lot of things we can keep around in there. When one
drawer is full, the apprentice pulls another and stacks it on top of the first.

In case the apprentice would still manage to fill it up, the last drawer of this
collection (*guard page*) will automatically trigger an alarm that fetches the
butler. The butler will turn off the alarm (the apprentice can use the drawer
then) and set a new alarm on the very next drawer.

This way, we will rarely run out of drawer space for the kind of stuff we want
to keep around. If we do (usually when we make a mistake in our instructions,
and our poor apprentice has been running around in circles for a while), our
plan completely falls apart. It is the famous "stack overflow", and the butler
will kick our apprentice out of the workshop. Oh well.

There's one drawback to the stack memory, though.

There's always a lot of stuff we want to keep around. Some of which we will
leave for a bit and return to later. That's fine.  But suppose I want to keep my
collection of newt eggs nice and tidy, all grouped together in a neat row.

If I place it in the stack and leave it there for a while, I'll inevitably start
placing other stuff I need to keep around in that same box, next to that
collection in my stack.

But what happens then if I find a new newt egg? Well, I'm a bit stuck. I would
like to add it next to the other newt eggs, but I've filled that space already.
It is fine for collection of stuff that never grows (if we know its size when we
write the instructions, i.e. at *compile time*), but for collection we want to
keep grouped together but don't know the size in advance, or that can grow, we
use a different approach: the Heap.

### The heap

What we call the heap is pretty much all the other drawers. The locked ones. If
we have a collection we want to keep together but can grow over time, instead of
struggling with the stack, we'll instruct the apprentice to call the butler, and
ask this gentleman for the drawer space we need (*dynamic allocation*).

The butler will make calculations and give us a key (or several if we need a lot
of drawer space) to some drawers, usually chosen in the top drawers first (at
the other end of where we pull the drawers for our stack).

Since we tell the butler how much space we need, he will sometimes tell us to
use space in a drawer we already have access to. For instance, if we tell the
butler we need to store a Giant's hair, he could tell us to stuff it in the
drawer over the etched number #6, first box, first subdivision. And later, when
we call him again to store a pouch of fairy dust, he can tell us "Well, it'll
fit in that same drawer over the number #6, second box, first subdivision".

Now, if our collection grows, we'll simply ask the butler for a new space large
enough to store the entire collection, move everything there, and return to the
butler the keys to the previous location we've just moved the collection from.

Of course, it would be pretty rude to avoid giving back the key when we're done
using the drawers (*memory leak*). Better make sure it's part of the
instructions given to the apprentice, because they're not going to think of that
on their own.

## A busy workshop

So far we've described things as if our apprentice was alone with the butler in
that workshop. Well, usually, there are multiple programs running simultaneously
on a computer.

That means, there's a crowd of apprentices, in that workshop, and the butler is
quite busy.

There's a limited amount of desks, though. Maybe 6-8, maybe 4, maybe 12 or more
(*number of cores in the processor*).

So when things get busy, the apprentices queue for accessing the desks and take
turns (*context switch*).

This is where what we said about that L3 cache being shared with others comes
back. There's only one such cabinet in the whole workshop, and everyone uses it.

Each apprentice has their own wall of drawers, though. There can be more walls
than desks. Geometry can get funny in these magic places, I guess.

```aside> There's still a limit to how many drawers there can be at a time
There's a secret trick to make it work: slots where the drawers are placed can
be accessed from behind the wall too, and the butler sometimes grabs a drawer
from a queuing apprentice and brings it down to the cellar (*paging*). When that
apprentice gets their turn, the butler will return the drawer from the cellar.
This only happens in extreme cases.
```

So with everyone taking turn, from time to time, our apprentice will be
interrupted by the butler, to leave the desk for another apprentice, and gets
queuing.

Although that can happen at any time (*preemption* in modern architectures), the
apprentice is way more likely to be interrupted by the butler when they reach
out to him. Fair enough, isn't it?

## A bad day in an apprentice alchemist life

Although we are elite master alchemist, it pains me to admit that we sometimes
make mistakes. And sometimes, the instructions we give our trusty apprentice may
have a tiny flaw.

Maybe we forgot about the additional `'\0'` character at the end of a character
string, and skipped it. Now, when our instructions tell our apprentice to read
that character string until the end, that is, until the special `'\0'`
character, they'll never stop. They'll look into every sub-partition of every
box of every drawer, through the whole wall.

Maybe we get lucky and they stumble upon a random `0` laying about.

Maybe we're not that lucky and they go on. Maybe we're really unlucky, and the
apprentice, in their dull obediance, reaches for a drawer beyond ours.

As long as they were browsing our own stuff, it was of course spouting
non-sense, but it was not so bad. As soon as we reach out of our allowed drawer
allocation, it's a different story.

This alerts the butler, and, long story short, you have to find a new
apprentice (*segmentation fault*).  Now that I think about it, maybe that's why
these apprentices never graduate.

##
```pitfall
There is a limit to every metaphor. This one is no exception. it will serve us
well in the future lessons, and could likely continue to serve you for years.

Let me address a number of limits:
- The apprentice in the metaphor represents both the program and the CPU.
  - The CPU is always there. In that sense, it's more the desk than the
    apprentice.
  - Fetching the data from the RAM to the registries is operated by the *bus*,
    not the CPU.
- There is a lot of complexity in how the processor operate that is not
  mentioned here (*pipelining*, *branch-prediction*, *out-of-order execution*,
  *superscalar*, ...)
- There is more complexity to the L-Caches.
- The metaphor doesn't explain that the wall of drawers is the virtual memory
  space, and there is a physical memory space mapped by the OS.
- The memory is presented as a two-dimensional array. The logical representation
  of memory should rather be a very long one-dimensional ribbon, although its
  physical layout is indeed two-dimensional.
- The limits of the stack and why it can't deal with data for which the size is
  unknown at compile-time is at best glossed-over.
- The segmentation fault example with the unterminated string is highly
  unlikely. It is accurate in its principles, but the chances of **not**
  encountering any `0` before leaving the virtual address space are almost
  non-existent.
```

```recap
- The CPU execute the instructions the programmer provides mechanically, without
  judgement.
- The RAM (Random Access Memory) stores everything the program needs, addressed
  by numbers.
- The Registers are the CPU's working space. Where operations happen.
- Moving data from the RAM to the CPU takes time.
- Caches (L1/L2/L3) reduce this time by staging frequently-used data closer to
  the CPU.
- The stack holds temporary values for the current task; it is fast but fixed in
  shape.
- The heap holds dynamic allocations; it is flexible but requires explicit
  management. Don't forget to give that memory back when you're done.
- The OS mediates access to resources (memory, storage, CPU scheduling...).
- Multiple programs share the hardware. They take turn when needed, but keep
  their memory isolated from each other.
- Mistakes in the program can produce unauthorised operations such as reading or
  writing memory it doesn't own, which can result in the OS terminating the
  program.
```
