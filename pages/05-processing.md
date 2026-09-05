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

As a master alchemist (a *programmer*), you rarely enter the lab yourself.
Instead, you send your apprentice. The poor soul is very obedient and follows
all your instructions by the letter, but is somewhat lacking in judgement. You
give them some scrolls with all the instructions (the *compiled code*), and they
scrupulously go through them. If the instruction tells to set fire to a black
powder keg, they'll do it without a second thought.

Yet, this apprentice of yours (the *CPU*) is your arms and hands in the
laboratory.

## Memory

The workshop has a large wall of drawers (the *RAM*). Millions of drawers. Each
drawer lies in its slot on the wall, and each slot has a number etched on its
bottom shelf. Under the top left drawer the number #1 is etched. Under the
drawer next to it, the number #2, under the one after #3, and so on across the
whole wall.

### Memory pages

Inside each drawer, there are little boxes. Different laboratories (*computer
architectures*) have different box structures, but typically:
- A drawer contains 64 (8&times;8) boxes with high sides.
- Each of these box is divided in two by a separator that goes only a third of
  the way up the box.
- And each side of the separator is also divided in two by an even lower
  separator.
- This subdivision continues with lower and lower separators four more times.


<svg
   id="mem-page"
   width="100%"
   viewBox="0 0 210 210"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg">
  <path
      d="M -0.225,0 H 209.55 V 209.775 H -0.225 Z M 209.55,26.193749 h -210 m 210,26.19375 h -210 m 210,26.193749 h -210 m 210,26.193752 h -210 m 210,26.19375 h -210 m 210,26.19375 h -210 m 210,26.19375 h -210 M 183.35625,0 V 210 M 157.1625,0 V 210 M 130.96875,0 V 210 M 104.775,0 V 210 M 78.58125,0 V 210 M 52.3875,0 V 210 M 26.19375,0 v 210"
      style="fill:none;stroke:var(--text,#000000);stroke-width:3;stroke-dasharray:none"
      id="path1"
      sodipodi:nodetypes="ccccccccccccccccccccccccccccccccc" />
  <path
      d="m 209.55,13.096875 h -210 m 210,26.193749 h -210 m 210,26.193749 h -210 m 210,26.19375 h -210 m 210,26.193747 h -210 m 210,26.19375 h -210 m 210,26.19375 h -210 m 210,26.19375 h -210"
      style="fill:none;stroke:var(--text,#000000);stroke-width:1.5;stroke-dasharray:none"
      id="path2"
      sodipodi:nodetypes="cccccccccccccccc" />
  <path
      d="m 209.55,0 h -210 M 196.45312,0 V 210 M 170.25938,0 V 210 M 144.06563,0 V 210 M 117.87188,0 V 210 M 91.67813,0 V 210 M 65.48438,0 V 210 M 39.29063,0 V 210 M 13.09688,0 v 210"
      style="fill:none;stroke:var(--text,#000000);stroke-width:0.75;stroke-dasharray:none"
      id="path3" />
  <path
      d="M 0,0 0,210 M 0,6.5616665 l 210,0 M 0,19.658541 l 210,0 M 0,32.755416 l 210,0 M 0,45.852291 l 210,0 M 0,58.949165 l 210,0 M 0,72.04604 l 210,0 M 0,85.142915 l 210,0 M 0,98.239789 l 210,0 M 0,111.33666 l 210,0 m -210,13.09688 210,0 m -210,13.09687 210,0 m -210,13.09688 210,0 m -210,13.09687 210,0 m -210,13.09688 210,0 m -210,13.09687 210,0 m -210,13.09688 210,0"
      style="fill:none;stroke:var(--text,#000000);stroke-width:0.375;stroke-dasharray:none"
      id="path4" />
  <path
      d="M 6.5616665,0 V 210 M 19.658541,0 V 210 M 32.755416,0 V 210 M 45.852291,0 V 210 M 58.949165,0 V 210 M 72.04604,0 V 210 M 85.142915,0 V 210 M 98.239789,0 V 210 M 111.33666,0 V 210 M 124.43354,0 V 210 M 137.53041,0 V 210 M 150.62729,0 V 210 M 163.72416,0 V 210 M 176.82104,0 V 210 M 189.91791,0 V 210 M 203.01479,0 v 210"
      style="fill:none;stroke:var(--text,#000000);stroke-width:0.188;stroke-dasharray:none"
      id="path5"
      sodipodi:nodetypes="cccccccccccccccccccccccccccccccc" />
  <path
      d="M 0,0 0,210 M 0,3.2742187 l 210,0 M 0,9.822656 l 210,0 m -210,6.548437 210,0 m -210,6.548438 210,0 m -210,6.548437 210,0 m -210,6.548437 210,0 m -210,6.548438 210,0 M 0,49.11328 l 210,0 m -210,6.548437 210,0 m -210,6.548438 210,0 m -210,6.548437 210,0 M 0,75.30703 l 210,0 m -210,6.548437 210,0 m -210,6.548437 210,0 m -210,6.548438 210,0 m -210,6.548438 210,0 m -210,6.54844 210,0 m -210,6.54843 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54843 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54843 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54843 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0 m -210,6.54844 210,0"
      style="fill:none;stroke:var(--text,#000000);stroke-width:0.094;stroke-dasharray:none"
      id="path6" />
  <path
      d="M 3.2338333,0 V 210 M 9.7954998,0 V 210 M 16.357166,0 V 210 M 22.918833,0 V 210 M 29.480499,0 V 210 M 36.042166,0 V 210 M 42.603832,0 V 210 M 49.165499,0 V 210 M 55.727165,0 V 210 M 62.288832,0 V 210 M 68.850498,0 V 210 M 75.412165,0 V 210 M 81.973831,0 V 210 M 88.535498,0 V 210 M 95.097164,0 V 210 M 101.65883,0 V 210 M 108.2205,0 V 210 M 114.78216,0 V 210 M 121.34383,0 V 210 M 127.9055,0 V 210 M 134.46716,0 V 210 M 141.02883,0 V 210 M 147.5905,0 V 210 M 154.15216,0 V 210 M 160.71383,0 V 210 M 167.2755,0 V 210 M 173.83716,0 V 210 M 180.39883,0 V 210 M 186.9605,0 V 210 M 193.52216,0 V 210 M 200.08383,0 V 210 M 206.6455,0 v 210"
      style="fill:none;stroke:var(--text,#000000);stroke-width:0.047;stroke-dasharray:none"
      id="path7"
      sodipodi:nodetypes="cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" />
  <path
      style="fill:#ff0000;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="M 0,0 H 26.193749 V 26.19375 H 0 Z"
      id="path8" />
  <path
      style="fill:#ff7800;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="M 26.193749,0 H 52.3875 V 13.096876 H 26.193749 Z"
      id="path9" />
  <path
      style="fill:#ffed00;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="m 52.400725,0.0132285 h 13.09688 V 13.110105 h -13.09688 z"
      id="path10" />
  <path
      style="fill:#00ff00;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="m 78.58125,-0.0066148 h 13.09688 v 6.561667 H 78.58125 Z"
      id="path11" />
  <path
      style="fill:#00ffee;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="m 104.775,-0.0066148 h 6.56166 v 6.561667 H 104.775 Z"
      id="path12" />
  <path
      style="fill:#0070ff;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="m 130.96875,0 h 6.56167 v 3.274219 h -6.56167 z"
      id="path13" />
  <path
      style="fill:#cc00ff;fill-opacity:0.8;stroke:none;stroke-width:0.0470001;stroke-dasharray:none"
      d="m 157.16251,0 h 3.4455 v 3.274219 h -3.4455 z"
      id="path14" />
</svg>

This separating system allows to store many small ingredients in the shallow
tight grid at the bottom of a box, or only one very large ingredients at the top
of the box, or an intermediate number of medium ingredients at the intermediate
levels, or even a mix medium and small ingredients (*data*). The important part
is that each ingredient (*data*) can be stored isolated from other ingredients.

`````aside: Alignment, Padding
In the [previous chapter](04-aggregates.html#the-size-of-a-struct), we mentioned
briefly that the size of a `struct` can be deceiving, that it is not always the
sum of the size of its members, and that there can be gaps.

With this model, we can now explain why this happens:

- Each of the smallest square in [the illustration above](#mem-page) represents
  a single Byte.
- There are 4096 single Bytes in this illustration, as it is the most common
  size for a *memory page* in current architectures (you may have to zoom in).
- These Bytes are grouped in a specific way as per the grid structure:
  - At the lowest level it is a grid of 4096 single Bytes (purple).
  - At the level above, it is a grid of 2048 groups of 2 Bytes each (navy blue).
  - Then a grid of 1024 groups of 4 Bytes each (light blue).
  - A grid of 512 groups of 8 Bytes each (green).
  - A grid of 256 groups of 16 Bytes each (yellow).
  - etc.

Note that each Byte belongs to a single group of 2, 4, 8, 16... Bytes.

This is what we call the *alignment*. Although different architectures have
different mechanism, it is usually more efficient to read data from the memory
when it is *aligned*. For instance, to read a 32-bits `int` from a single 4-Byte
group, or a 64-bits floating-point value from a single 8-Byte group.

In the past, old architectures used to crash when this alignment was not
respected. Nowadays, modern architectures handle it without crashing, but
typically take more time. If a piece of data happens to straddle an alignment
boundary, and ends up having some of its Bytes in one group, and the rest in
another group, some architectures would load the data it two operations, reading
from one group at a time.

Now let's consider what that means for the `struct` we define.

Suppose we define a `struct` that starts with a 1-Byte-long member,
and then has a 4-Bytes-long member. For instance:

```cpp
struct AlignmentExample
{
  bool b;
  std::uint32_t i;
};
```

If this was laid out naively in memory, the 4-Bytes-long member `i` would be
misaligned:
- The 1-Byte-long member `b` would use the first Byte, which is also the first
  Byte of the first 4-Byte group.
- As a result, the first 4-Byte group would be left with only 3 Bytes left
  available.
- The 4-Bytes-long member `i` would overflow into the next 4-Byte group.

<table style="border-collapse: collapse; border:8px solid; margin-bottom: 1.1rem;">
  <tr>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code>&hellip;</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>&hellip;</code></td>
    <td style="padding: 8px; text-align: center;"><code>&hellip;</code></td>
  </tr>
</table>


But our compiler is clever and knows about this. It will handle it for us.
Instead of placing `i` right after `b`, it will leave a gap of 3 empty Bytes.

<table style="border-collapse: collapse; border:8px solid; margin-bottom: 1.1rem;">
  <tr>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
  </tr>
</table>

Now, `b` uses one Byte of the first 4-Byte group. The rest of this group is
"padded" with 3 empty Bytes. And `i` uses the full second 4-Byte group.

Our `struct` is properly aligned. But its size is 8 Bytes, not 5.

Note that it is more accurate to think of the memory as a long long
mono-dimensional ribbon rather than as a 2D grid. The grouping is not by squares
or rectangles, but by strips of consecutive Bytes in that ribbon.

````aside> More on alignment and padding...
Knowing about alignment and padding will help us understanding some constraints
of the language, later, but it can also have an impact on performances on its
own.

Consider the following structure:
```cpp
struct AlignmentExample2
{
  bool b;
  std::uint32_t i;
  char c;
};
```
The alignment constraint from above still applies for the same reasons, so there
will be 3 Bytes of padding between `b` and `i` as before.

The member `c` can be laid out immediately after `i` without padding, but
we will have to add more padding after it:

We have seen previously that [aggregates can be
composed](04-aggregates.html#composing-aggregates). This means we could have
another `struct` with a member of type `AlignmentExample2`, or simply, an array
of `AligmentExample2` structures.

Without additional padding, `AlignmentExample2` would be 9 Bytes long, but the
next `AlignmentExample2` element in the array would land out of alignment:

<table style="border-collapse: collapse; border:8px solid; margin-bottom: 1.1rem;">
  <tr>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 8px solid; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">c</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 8px solid; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
  </tr>
</table>

For this reason, and in a similar way than for `b` earlier, 3 more Bytes of
padding are added at the end of the `struct`.

<table style="border-collapse: collapse; border:8px solid; margin-bottom: 1.1rem;">
  <tr>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 8px solid; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">c</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
  </tr>
</table>

The good news is that this layout of the memory for this `struct` is perfectly
fine with regard to alignment. We can repeat it or composite and `i` will be
aligned. The bad news is that we now have a `struct` that holds 6 Bytes of data,
but takes up 12 Bytes in memory. A tad wasteful isn't it?

Turns out, we can improve things, if we care more about the space taken in
memory than we care about the order of members: we can put the member `c` in the
padding between `b` and `i`:
```cpp
struct AlignmentExample3
{
  bool b;
  char c;
  std::uint32_t i;
};
```
Now `AlignmentExample3` is only 8 Bytes long, with only 2 Bytes of padding:

<table style="border-collapse: collapse; border:8px solid; margin-bottom: 1.1rem;">
  <tr>
    <td style="border-right: 1px dashed; padding: 8px; text-align:center;"><code style="color:#cc00ff;">b</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#cc00ff;">c</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 4px solid; padding: 8px; text-align: center;"><code>-</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 2px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 1px dashed; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
    <td style="border-right: 8px solid; padding: 8px; text-align: center;"><code style="color:#00aa77;">i</code></td>
  </tr>
</table>

But the compiler won't make that decision for us. It will prevent us from
violating alignment constraints, but it will not change the order of the members
of our structures. We had to change the order of the members in the `struct`
definition to get this benefit.

So knowing about padding will allow us to pack our data more tightly in memory.
````

`````

### Process Memory Layout

When the apprentice enters the workshop, some drawers at the bottom of the wall
of drawers are directly available.
- The bottom rows to store the scrolls where the instructions are
written (the *compiled code*), so that it's easy to find them when needed.
- A few more rows of drawers above these to store the ingredients the apprentice
  came with (*static data*).
- And plenty more rows of empty drawers for the apprentice to work with on his
  own (the *stack*).

But all the drawers above that, the middle and top rows, are locked. If the
apprentice needs more drawer space to work with than the bottom rows, they have
to ask the butler who will give them a key, with a label on it indicating which
drawers have been made available for them (the *heap*).


````illus> What it looks like...
<svg viewBox="0 0 261 306" width="100%" height="100%" xmlns="http://w3.org">
  <defs>
    <!-- Define the master drawer template asset ONCE -->
    <g id="single-drawer">
      <!-- Drawer face uses dynamic row color variables -->
      <rect width="25" height="30" 
            fill="var(--drawer-fill)" 
            stroke="var(--drawer-stroke)" 
            stroke-width="1" />
      <!-- Drawer handle is locked completely to --border -->
      <path fill="var(--muted, rgb(0, 0, 0))" 
            stroke="var(--muted, rgb(0, 0, 0))" 
            stroke-width="1"
            d="M 10.677 13.102 H 14.323 A 3 1.899 0 0 1 17.323 15.001 V 16.899 A 0 0 0 0 1 17.323 16.899 H 7.677 A 0 0 0 0 1 7.677 16.899 V 15.001 A 3 1.899 0 0 1 10.677 13.102 Z" />
    </g>
  </defs>

  <style>
    /* Scoped Variable Mappings linking to your system templates */
    .row-aside {
      --drawer-fill: var(--aside, rgb(216, 216, 216));
      --drawer-stroke: var(--aside-border, rgb(0, 0, 0));
      --text-color: var(--aside-label, var(--aside-border, rgb(0, 0, 0)));
    }
    .row-pitfall {
      --drawer-fill: var(--pitfall, rgb(216, 216, 216));
      --drawer-stroke: var(--pitfall-border, rgb(0, 0, 0));
      --text-color: var(--pitfall-label, var(--pitfall-border, rgb(0, 0, 0)));
    }
    .row-recap {
      --drawer-fill: var(--recap, rgb(216, 216, 216));
      --drawer-stroke: var(--recap-border, rgb(0, 0, 0));
      --text-color: var(--recap-label, var(--recap-border, rgb(0, 0, 0)));
    }
    .row-principle {
      --drawer-fill: var(--principle, rgb(216, 216, 216));
      --drawer-stroke: var(--principle-border, rgb(0, 0, 0));
      --text-color: var(--principle-label, var(--principle-border, rgb(0, 0, 0)));
    }

    .cabinet-bg {
      fill: var(--bg, rgb(240, 240, 240));
    }

    /* Typographic Overlays Layout */
    .overlay-text {
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      fill: var(--text-color);
      user-select: none;
      pointer-events: none; /* Allows pointer clicks to pass through text elements directly onto drawers */
    }

    /* Semi-transparent text backing box */
    .label-pill {
      fill: var(--bg, rgb(240, 240, 240));
      fill-opacity: 0.4;
    }

    /* Central Gap Indicator Styles */
    .gap-line {
      stroke: var(--text, rgb(0, 0, 0));
      stroke-dasharray: 4 4;
      stroke-width: 1;
      opacity: 0.5;
    }
    .gap-text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10px;
      font-style: italic;
      fill: var(--text, rgb(0, 0, 0));
      text-anchor: middle;
      user-select: none;
    }
    .gap-mask {
      fill: var(--bg, rgb(240, 240, 240));
    }
  </style>

  <!-- ========================================== -->
  <!-- BACKING REGIONS (Original Specs)           -->
  <!-- ========================================== -->
  <g id="cabinet-housing">
    <rect class="cabinet-bg" x="0" y="0" width="261" height="68" />
    <!-- Central Gap (34px empty region from Y=68 to Y=102) -->
    <rect class="cabinet-bg" x="0" y="102" width="261" height="204" />
  </g>

  <!-- ========================================== -->
  <!-- ASIDE ROWS (Top 2 Rows: Y=2, Y=36)         -->
  <!-- ========================================== -->
  <g class="row-aside">
    <use href="#single-drawer" x="-12.5" y="2" /><use href="#single-drawer" x="-12.5" y="36" />
    <use href="#single-drawer" x="16.5" y="2" /><use href="#single-drawer" x="16.5" y="36" />
    <use href="#single-drawer" x="45.5" y="2" /><use href="#single-drawer" x="45.5" y="36" />
    <use href="#single-drawer" x="74.5" y="2" /><use href="#single-drawer" x="74.5" y="36" />
    <use href="#single-drawer" x="103.5" y="2" /><use href="#single-drawer" x="103.5" y="36" />
    <use href="#single-drawer" x="132.5" y="2" /><use href="#single-drawer" x="132.5" y="36" />
    <use href="#single-drawer" x="161.5" y="2" /><use href="#single-drawer" x="161.5" y="36" />
    <use href="#single-drawer" x="190.5" y="2" /><use href="#single-drawer" x="190.5" y="36" />
    <use href="#single-drawer" x="219.5" y="2" /><use href="#single-drawer" x="219.5" y="36" />
    <use href="#single-drawer" x="248.5" y="2" /><use href="#single-drawer" x="248.5" y="36" />
  </g>

 <g id="gap-indicator">
    <line class="gap-line" x1="0" y1="85" x2="261" y2="85" />
    <!-- Backdrop mask block splits the dashed line path smoothly around text -->
    <rect class="gap-mask" x="55" y="78" width="151" height="14" />
    <text class="gap-text" x="130.5" y="88">many more rows of drawers</text>
  </g>

  <!-- ========================================== -->
  <!-- PITFALL ROWS (3 Rows: Y=104, Y=138, Y=172) -->
  <!-- ========================================== -->
  <g class="row-pitfall">
    <use href="#single-drawer" x="-12.5" y="104" /><use href="#single-drawer" x="-12.5" y="138" /><use href="#single-drawer" x="-12.5" y="172" />
    <use href="#single-drawer" x="16.5" y="104" /><use href="#single-drawer" x="16.5" y="138" /><use href="#single-drawer" x="16.5" y="172" />
    <use href="#single-drawer" x="45.5" y="104" /><use href="#single-drawer" x="45.5" y="138" /><use href="#single-drawer" x="45.5" y="172" />
    <use href="#single-drawer" x="74.5" y="104" /><use href="#single-drawer" x="74.5" y="138" /><use href="#single-drawer" x="74.5" y="172" />
    <use href="#single-drawer" x="103.5" y="104" /><use href="#single-drawer" x="103.5" y="138" /><use href="#single-drawer" x="103.5" y="172" />
    <use href="#single-drawer" x="132.5" y="104" /><use href="#single-drawer" x="132.5" y="138" /><use href="#single-drawer" x="132.5" y="172" />
    <use href="#single-drawer" x="161.5" y="104" /><use href="#single-drawer" x="161.5" y="138" /><use href="#single-drawer" x="161.5" y="172" />
    <use href="#single-drawer" x="190.5" y="104" /><use href="#single-drawer" x="190.5" y="138" /><use href="#single-drawer" x="190.5" y="172" />
    <use href="#single-drawer" x="219.5" y="104" /><use href="#single-drawer" x="219.5" y="138" /><use href="#single-drawer" x="219.5" y="172" />
    <use href="#single-drawer" x="248.5" y="104" /><use href="#single-drawer" x="248.5" y="138" /><use href="#single-drawer" x="248.5" y="172" />
  </g>

  <!-- ========================================== -->
  <!-- ILLUS ROWS (2 Rows: Y=206, Y=240)          -->
  <!-- ========================================== -->
  <g class="row-recap">
    <use href="#single-drawer" x="-12.5" y="206" /><use href="#single-drawer" x="-12.5" y="240" />
    <use href="#single-drawer" x="16.5" y="206" /><use href="#single-drawer" x="16.5" y="240" />
    <use href="#single-drawer" x="45.5" y="206" /><use href="#single-drawer" x="45.5" y="240" />
    <use href="#single-drawer" x="74.5" y="206" /><use href="#single-drawer" x="74.5" y="240" />
    <use href="#single-drawer" x="103.5" y="206" /><use href="#single-drawer" x="103.5" y="240" />
    <use href="#single-drawer" x="132.5" y="206" /><use href="#single-drawer" x="132.5" y="240" />
    <use href="#single-drawer" x="161.5" y="206" /><use href="#single-drawer" x="161.5" y="240" />
    <use href="#single-drawer" x="190.5" y="206" /><use href="#single-drawer" x="190.5" y="240" />
    <use href="#single-drawer" x="219.5" y="206" /><use href="#single-drawer" x="219.5" y="240" />
    <use href="#single-drawer" x="248.5" y="206" /><use href="#single-drawer" x="248.5" y="240" />
  </g>

  <!-- ========================================== -->
  <!-- PRINCIPLE ROW (Bottom 1 Row: Y=274)        -->
  <!-- ========================================== -->
  <g class="row-principle">
    <use href="#single-drawer" x="-12.5" y="274" />
    <use href="#single-drawer" x="16.5" y="274" />
    <use href="#single-drawer" x="45.5" y="274" />
    <use href="#single-drawer" x="74.5" y="274" />
    <use href="#single-drawer" x="103.5" y="274" />
    <use href="#single-drawer" x="132.5" y="274" />
    <use href="#single-drawer" x="161.5" y="274" />
    <use href="#single-drawer" x="190.5" y="274" />
    <use href="#single-drawer" x="219.5" y="274" />
    <use href="#single-drawer" x="248.5" y="274" />
  </g>

  <!-- ========================================== -->
  <!-- TEXT LABELS OVERLAYS                       -->
  <!-- ========================================== -->
  <!-- Rendered at the end of the file so they sit exactly on top of everything -->
  
  <!-- "Heap" overlay over Aside rows (centered vertically in its area) -->
  <g class="row-aside" transform="translate(200, 26)">
    <rect class="label-pill" x="-4" y="-10" width="42" height="15" rx="3" />
    <text class="overlay-text">Heap</text>
  </g>

  <!-- "Stack" overlay over Pitfall rows -->
  <g class="row-pitfall" transform="translate(200, 148)">
    <rect class="label-pill" x="-4" y="-10" width="46" height="15" rx="3" />
    <text class="overlay-text">Stack</text>
  </g>

  <!-- "Data" overlay over Illus rows -->
  <g class="row-recap" transform="translate(200, 230)">
    <rect class="label-pill" x="-4" y="-10" width="40" height="15" rx="3" />
    <text class="overlay-text">Data</text>
  </g>

  <!-- "Code" overlay over Principle row -->
  <g class="row-principle" transform="translate(200, 292)">
    <rect class="label-pill" x="-4" y="-10" width="40" height="15" rx="3" />
    <text class="overlay-text">Code</text>
  </g>
</svg>

The rows of drawers between the Heap and the Stack drawers can be unassigned,
used for the Heap (at the top), or used by the Stack (at the bottom). If we run
out of unassigned drawers (because both the Heap and the Stack have grown so
much they end-up meeting), the butler might get into trouble.
````


There is also a lot of stuff stored in the cellar (the *drive memory*), a
market in the nearby town (*networking*) and other sources of ingredients, but
that all requires asking the butler (the *Operating System*) and takes time to
bring over.

## Registers

Opposite the wall of drawer is the desk where the apprentice works, grinding,
mincing, crushing, mixing the ingredients into potions or new ingredients.

These operations happen in special stone vessels (*registers*) that are
structures like the boxes in the drawers: a high rim around, a lower separator,
and lower and lower subdivisions all the way down.

There's at least two different kind of such vessels, and at least 16 of each
kind. This varies depending on the alchemy workshop (*hardware architecture*).

There is also a slate and chalk in a corner of the desk (the *instruction
register*).

## L-Caches

Right next to the desk there are a handful of containers labeled "L1". About a
meter away there are a few dozen containers of the same size with the label
"L2", and a couple meters further away, a full cabinet of them, hundreds, with
the label "L3".

These containers are magical devices. You can pick stuff from them, but not
place things into them. Instead, every time your apprentice passes by them, they
magically copy whatever is in your apprentice's hands into one of the container.
It is most convenient for staging the ingredients the apprentice will use the
most.
- Only a few can be put in the L1-labeled containers, but they can be grabbed
  without moving from the desk.
- There are more of the L2-labeled containers, but the apprentice has to step
  out of their chair to reach them.
- Finally, the L3 cabinet has plenty of containers, and is still faster to
  access than crossing the whole room to reach the wall of drawers, but it is
  shared with other apprentices.

## A typical day in an apprentice alchemist life

Let us look at what a good day's work looks like for your apprentice.

### Setting up for work

Arriving in the room, your apprentice places the scrolls with the instructions
you have given them in the first drawers near the entry. He also hands over a
specific scroll to the butler instructing them to place the ingredients they
brought in the freely available drawers at the bottom, next to where they have
placed the instruction scrolls.

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
opens a special trap door below the ingredient the instruction specified.

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
the L1-cache copy of the destination box. Then they flip a little glowing flag
on the copy that reads "DIRTY".

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
- If that flag is down, we can just throw the old content away in the furnace.
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
something we want to keep around, we need to take it back to a drawer.

You remember that most of the drawers are locked and the apprentice would have
to ask the butler for a key to use them. That's rather annoying. So instead, we
use that drawer the apprentice has pulled off its slot at the start.

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
butler the keys (*deallocation*) to the previous location we've just moved the
collection from.

Of course, it would be pretty rude to forget giving back the key when we're done
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

But when it does happen, it takes a while to get these drawers back, making for
noticeable lag.
```

So with everyone taking turn, from time to time, our apprentice will be
interrupted by the butler, will leave the desk for another apprentice, and get
queuing.

Though that can happen at any time (*preemption* in modern architectures), the
apprentice is way more likely to be interrupted by the butler when they reach
out to him. Fair enough, isn't it?

## A bad day in an apprentice alchemist life

Although we are elite master alchemist, it pains me to admit that we sometimes
make mistakes. And sometimes, the instructions we give our trusty apprentice may
have a tiny flaw.

Maybe we forgot about the additional `'\0'` character at the end of a character
string, and skipped it. Now, when our instructions tell our apprentice to read
that character string until the end, that is, until the special `'\0'`
character, they'll just keep going until they find a stray `0` by sheer luck,
somewhere in the memory.

Or suppose we've put an image in the stack, so that we keep it at hand. Let's
say it's a 100&times;100 greyscale image, so it uses a `std::array<std::byte,
10000>`. It's taking up a few drawers, since each drawer can hold at most 4096
Bytes in our architecture. So far so good, but when telling our apprentice to
retrieve the intensity of a specific pixel of that image, we got our numbers
wrong, and we multiplied the index by 100. Instead of telling our apprentice to
look for the 8750th Byte in the array, we told him to fetch the 87500th one.

That's more than 20 drawers beyond the mark. Chances are, that's out of your
walls of drawers.

If your stack is already well stocked, that would likely land somewhere in
there, and your apprentice would return with a random item. It's not the
ingredient you expected, but that's not too bad.

It could be a little worse. If you had instructed your apprentice to change this
value, he's now changing something else (*memory corruption*). That could make
for nasty surprises later down the line.

But it could also be much worse. If your stack has not much else than this array,
your apprentice might end up looking for drawers past the ceiling. And no, that
won't stop it from trying.

When he starts attacking the ceiling with a pickaxe, that will not escape the
butler's attention, and, well, long story short, you have to find a new
apprentice (*segmentation fault*).  Now that I think about it, maybe that's why
these apprentices never graduate.
 

##
```pitfall
There is a limit to every metaphor. This one is no exception. It will serve us
well in the future lessons, and could likely continue to serve you for years,
but it has a few flaws.

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
- The limits of the stack and why it can't deal with data for which the size is
  unknown at compile-time is at best glossed-over.
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
