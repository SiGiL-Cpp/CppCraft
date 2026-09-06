---
title: "06 — Operations"
prev: "05-processing"
next: "07-tbd"
---

We have learned about [Types](03-types.html), and built a [simplified model of
the processor and its surrounding](05-processing.html). Now that we have the raw
material (data) and a workbench (the hardware), it is time to set things in
motion and start crafting.

# 06 - Operations

## Expressions

In C++, expressions can do a lot of things. Formally, they are defined as "a
sequence of operators and operands that specifies a computation". In other
words, they are the individual steps of the receipes our apprentice (CPU)
elaborates at the desk in the stone vessels (registers).

### Arithmetic Operators

The first type of expressions that comes to mind are arithmetic operators
such as `+`, `-`, `*`, `/`. No surprise here, hopefully: `1 + 1` is an
expression that yields the value `2`.

`-` and `+` can also be used with a single value: `-42` is technically `-`
applied to `42`. Because it is an operation on a single value, it is called
"unary". `+` is mostly there for the symmetry with `-`.

In addition, we also get the `%` operator, called remainder or modulo operator.
It gives the remainer of a division: `11 % 3` is `2`, because 11 is 3&times;3 +
2.

````aside> For readers adept at binary: bitwise operators
There are also operators acting on the bitwise representation of the values.

These operations are not available for all the types, though. Natively, it is
only available for integral types at least as large as `int`. Smaller integral
types would first get promoted to `int`. That will make giving examples a bit
cumbersome.

C++ offers specific [literals](03-types.html#literals) to write numbers in
binary and hexadecimal, by prefixing the numbers by `0b` and `0x` respectively:
the number `12` in decimal can be written as `0b1100` in binary, or `0x0c` in
hexadecimal. For convenience, we will use numbers such as `0xffff0000` and
`0x00ffff00` for our examples. `0xf` correspond to four consecutive 1s in
binary: `0b1111`.

- `~` is the unary operator for the "not" operation: swapping all the 1s for 0s
  and all the 0s for 1s in the binary representation. `~0x00ffff00` is
  `0xff0000ff`.
- `&` is the bitwise AND operator: `0x0000ffff & 0x00ffff00` is `0x0000ff00`
  (only the bits present in both operands are kept).
- `|` is the bitwise OR operator: `0xff000000 | 0x000000ff` is `0xff0000ff` (any
  bit that is 1 in either operand is kept).
- `^` is the bitwise XOR operator (eXclusive OR): `0x0000ffff ^ 0x00ffff00`is
  `00ff00ff` (only the bits differing between both operands are kept)
- `<<` shifts the bits of the left-hand-side operand by the right-hand-side
  operand number of bits to the left: `0x0000ffff<<4` is `0x000ffff0`. The
  vacated bits are filled with 0s.
- `>>` shifts the bits of the left-hand-side operand by the right-hand-side
  operand number of bits to the right: `0x0000ffff>>4` is `0x00000fff`. The
  vacated bits are filled with 0s for unsigned ints and for positive signed
  ints, but with 1s for negative signed ints (so that the sign bit is kept).
  This is guaranteed since C++20.

````

### Logical Operators

[Boolean values](01-data.html#bytes-as-true-false-on-off-yes-no-values) have
their own operators:
- `&&` is the "and" operator. It evaluates to `true` only when both operands are
  `true`.
- `||` is the "or" operator. It evaluates to `true` if any operand is `true`.
- `!` is the unary "not" operatod. It changes `true` into `false`, and `false`
  into `true`.

### Comparison Operators

Values can also be compared. We use `==` (equal), `!=` (not equal), `<`
(strictly less), `>` (strictly greater), `<=` (less or equal), and `>=` (greater
or equal). All of these operations evaluate to a `true` or `false` value (a
[boolean](01-data.html#bytes-as-true-false-on-off-yes-no-values)) for native
types.

While this is relatively self-explanatory, the semantics (specific meaning) of
these operations can sometimes be ambiguous.

- The unambiguous case would be what we call **"strong ordering"**. This is when
  we can order all the elements, and when two elements are equal, they are
  exactly the same thing. 

````illus: Strong ordering
Remember our [light intensities](01-data.html#bytes-as-light-intensity)? Given
two different light intensity values (`197` and `63`), the order is obvious (`63
< 197`). And if two pixel of an image have the same light-intensity value,
that's genuinely the same light intensity: we can exchange them and the image is
unchanged.
````

- But sometimes, equality is not the same as identity. This is what we call
**"weak ordering"**.

````illus: Weak ordering
Suppose you compare children based on their Date of Birth. In most case, the
ordering will be easy: the '29th of February 2020' comes before the '1st of
May 2020', fine. But being born on the same day doen't make two children the
same person. Returning to parents a child that lived the same number of days
than their own might not be good enough, some are bound to notice.
````

- Finally, there are things for which some values can be compared, but other
  values can't be compared. Because some parts can be ordered and other parts
  can't, we call this **"partial ordering"**.

````illus: Partial ordering
Now we're organising songs and musical pieces, and we had the brilliant idea to
sort them by their tonality, or rather by their fundamental frequency. If a
piece changes fundamental, we use the first one. So far, that's weak ordering:
several pieces could have the same fundamental frequency while retaining their
unique identity.

Then we stumble on John Cage's
[4'33"](https://en.wikipedia.org/wiki/4%E2%80%B233%E2%80%B3), a piece that is
entirely silent. No sound, no fundamental, no tonality... Fine, we call it 0
frequency, and it will be the very first of our list. Our ordering survived that
one.

But then comes [Merzbow (Masami Akita)](https://en.wikipedia.org/wiki/Merzbow), a Japanese artist known for his harsh
noise music, who uses a lot of white and pink noise in his compositions. Now we
have the opposite problem: white and pink noise are "all frequencies at the same
time".

<p align="center">
<strong>"Merzbow, what is the fundamental frequency of your piece?"</strong>
<img src="imgs/origin-of-the-yes-meme.webp" alt="yes" width="100%" style="max-width:400px"/>
</p>

We could come up with more rules to make up an arbitrary ordering, but
objectively, they don't really compare with the other songs.
````

````aside> The spaceship operator <=>
Since C++20, a new comparison operator has been introduced: the three-way
comparison operator `<=>`. It is the all-in-one comparison: it answers at the
same time whether the operands are equal, less or greater.

The semantics of this newer operator solve the issue explained above. It returns
one of these three types:

- `std::strong_ordering`, which can have one of these values:
  - `less`
  - `equivalent` or `equal`
  - `greater`
- `std::weak_ordering`, which can have one of these values:
  - `less`
  - `equivalent` (but <u>not</u> `equal`)
  - `greater`
- `std::partial_ordering`, which can have one of these values:
  - `less`
  - `equivalent` (but <u>not</u> `equal`)
  - `greater`
  - `unordered`

`std::strong_ordering::equivalent` and `std::weak_ordering::equivalent` are
different values. The former means that the operands are the same thing,
interchangeable, while the latter only means they have the same rank in the
ordering.
````

### Assignment Operators

These operations modify their left-hand-side operand, and so can only be applied
if that left-hand-side operand is modifiable. For instance, they would work if
the left-hand-side operand is a (non-`const`)
[variable](03-types.html#variables), but would fail if it was a
[literal](03-types.html#literals).
