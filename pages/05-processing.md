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

The workshop has a large wall of drawers (the *RAM*). Thousands, hundreds of
thousands of drawers. Each drawer lies in its slot on the wall, and each slot
has a number etched on its bottom shelf. Under the top left drawer the number
#1 is etched. Under the drawer next to the number #2, under the one after #3,
and so on across the whole wall.

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
each ingredient can be stored isolated from other ingredients.

### Process Memory Layout

When the apprentice enters the workshop, some of the bottom drawers are directly
available.
- The bottom right ones to store the scrolls where the instructions are
written (the *compiled code*), so that it's easy to find them when needed.
- A few more drawers to store the ingredients the apprentice came with.
- And plenty of empty drawers for the apprentice to work with.

But all the drawers above that are locked. If the apprentice needs more drawer
space to work than the bottom few, they have to ask the butler who will give
them a key, with a label on it indicating which drawers have been made available
for them.

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

## A typical day in an apprentice alchemist life

Let us look at what a good day's work looks like for your apprentice.

### Setting up for work

Arriving in the room, your apprentice places the scrolls with the instructions
you have given them in the first drawers near the entry. He also hands over a
specific scroll to the butler instructing them to place the ingredients they
brought in the freely available drawers at the bottom, next to where they have
placed the scrolls.

They pull a drawer off the wall and leave it out for later (the *stack frame*).

Then they reache for the first scroll of instructions.

### Starting the work

#### Reding instructions

Since your apprentice cannot memorize the full set of scrolls (there's an awful
lot of them, and well, you know that apprentice has their own challenges), they
start by picking the first one, carfully copy sixteen or so instructions, and
walk to the desk.

The magical L-containers (*CPU-cache* or *L-cache*) create a copy of the
apprentice node as they pass by. One copy lands in a container labeled "L3"
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

At the desk, the apprentice places the box over on of the stone vessel, and
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

The new instruction requires another ingredient. There's two cases.
- If we're unlucky, the apprentice has to return to the wall, grab the box in
  the drawer, come back with a copy of it.
- But if we're lucky, that other ingredient was in the same box as the first, in
  which case, there will be a copy of it in the L1 cache, reachable from the
  desk.

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
there, but modern alchemy schools teach apprentices to do it a different way:
- The apprentice goes to the wall of drawer and grabs a copy of the target box
  inside the the destination drawer.
- They come back with the box copy (the cache containers copy the box as they
  pass by).
- And the apprentice tosses the box right into the furnace.

Yup. Just like that. No mistake here, the apprentice brought the box just to
throw it into the furnace. But there's a trick. The apprentice brought it there
just so that it's in the L1 cache.

They now scoop the mix from the stone vessel (the register) and dump it into
the L1-cache copy. Then they flip a little glowing flat on the copy that reads
"DIRTY".

Of course, of the destination already had a copy inside the L1 cache, the
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
  - What do we do then? We copy the box back into the L2 cache, and switch its
    "DIRTY" flag up.
  - The L2 cache has more containers, so it'll keep it a while, but eventually,
    it will also run out.
  - And we then copy that box back to the L3 cache, with its dirty flag up.
  - Finally, when the L3 cache wants to free the container, we write it back to
    the actual drawer.

All this cascade of smaller operations saves a lot of longer back and forth to
the wall.

