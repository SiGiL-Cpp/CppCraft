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
processor and its surrounding. It will be very helpful for understanding several
otherwise tricky aspects of C++ that would otherwise look like arbitrary rules.

## CPU

As a master alchemist (a programmer), you rarely enter the lab yourself.
Instead, you send your apprentice. The poor soul is very obedient and follows
all your instructions by the letter, but is somewhat lacking in judgement. You
give them some scrolls with all the instructions (the compiled code), and they
scrupulously go through them. If the instruction tells to set fire to a black
powder keg, they'll do it without a second thought.

Yet, this apprentice of yours (the CPU) is your arms and hands in the
laboratory. Maybe they even have a few extra pair of arms and hands, by the way.

## Memory

The workshop has a large wall of drawers (the RAM). Hundreds, thousands of
drawers. Each drawer has a label with a number. The top left drawer has the
label #1, the drawer next to it has the label #2, the one after #3, and so on
across the whole wall.

### Memory pages

Inside each drawer, there are little compartments. Typically:
- The drawer is divided in an 8&times;8 grid of high separators.
- But each cell of that grid is itself divided in two by lower separators.
- And each sub-cell is itself divided in two by even lower separators.
- This subdivision continues with lower and lower separators four more times.

This separating system allows to store many small ingredients in the shallow
tight grid at the bottom of the drawer, few very large ingredients isolated
by the high separators, an intermediate number of medium ingredients, or even a
mix of all this. The important part is that each ingredient can be stored
isolated from other ingredients.

### Process Memory Layout

When the apprentice enters the workshop, some of the bottom drawers are directly
available.
- The bottom right ones to store the scrolls where the instructions are
written (the compiled code), so that it's easy to find them when needed.
- A few more drawers to store the ingredients the apprentice came with.
- And plenty of empty drawers for the apprentice to work with.

But all the drawers above that are locked. If the apprentice needs more drawer
space to work than the bottom few, they have to ask the butler who will give
them a key with a label on it, indicating which drawers have been made available
for them.

There is also a lot of stuff stored in the cellar (the drive memory), a
market in the nearby town (networking) and other sources of ingredients, but
that all requires asking the butler and takes time to bring over.

## Registers

Opposite the wall of drawer is the desk where the apprentice works, grinding,
mincing, crushing, mixing the ingredients into potions or new ingredients.

These operations happen in different bowls, mortars, test tubes, decanters...
but there are only so many that fit on the desk, and each of these vessels can
usually only hold a single dose of whatever ingredient they are made for.

## L-Caches

Right next to the desk there are a handful of containers labeled "L1". About a
meter away there are a few dozen containers of the same size with the label
"L2", and a meter further away, a full cabinet of them, hundreds, with the label
"L3".

These containers are used as staging for the ingredients the apprentice will use
the most.
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
you have given them in the first drawers near the entry. Then they place the
ingredients they have brought in the next few drawers.

They pull a drawer off the wall and leave it out for later.

Then the reach for the first scroll of instructions.

### Starting the work

Your apprentice starts reading and obeying your instructions. As you are well
aware the unfortunate creature could not tell crushed tadpoles from fairy paste,
so all your ingredients are labeled, and you refer to them by their labels,

> "Take the ingredient in box #8 and mix them with the ingredient in bowl #3."

Your apprentice reaches for the ingredient, carries it to the desk, places it in
the specified vessel, and proceed with the indicated operation.
TODO: place copy in cache. Copy instruction locally.
