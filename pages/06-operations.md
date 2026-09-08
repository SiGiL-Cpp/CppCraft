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
words, they are the individual steps of the recipes our apprentice (CPU)
elaborates at the desk in the stone vessels (registers).

### Arithmetic Operators

The first type of expressions that comes to mind are arithmetic operators
such as `+`, `-`, `*`, `/`. No surprise here, hopefully: `1 + 1` is an
expression that yields the value `2`.

`````pitfall
While this looks easy and simple on the surface and is mostly trivial to use
most of the time, there are a few sharp edges.

- First, "small" types, like `bool`, `char`, `short`, are converted (promoted)
  to `int` before the operation takes place.

```playground: Small types promoted to int
id: arithmetic-small-type
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout <<
boilerplate_after: |
  << "\n";
  }
default_code: |
  'a' + 'b'
```

- Second, if after that promotion, the operands are of the same type, the result
  of the operation will be of that same type too.
  - This means that dividing `int` by `int` evaluates to an `int` too.

```playground: Integral division
id: arithmetic-integral-division
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout <<
boilerplate_after: |
  << "\n";
  }
default_code: |
  12 / 5
```

- Third, otherwise, if after the promotion of short types, the operands are
  still of different types, the compiler will promote them to a common type.
  - One simple rule there is that if one operand is of a floating-point type and
    the other isn't, the floating-point type is chosen as the common type.
    - That's how we will get a floating point result from a division: by having
      at least one operand be a floating point.

```playground: Float division
id: arithmetic-float-division
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout <<
boilerplate_after: |
  << "\n";
  }
default_code: |
  12 / 5.0f
```

Beyond this, things can get a bit convoluted.

````pitfall> Give me the convoluted stuff!
Ok, you asked for it.

- If both types are floating-point, the higher order one is chosen.
  - A `float` and a `double` produce a `double`.
  - Two `float` produce a `float`, two `double` produce a `double`.
- As we said before, if one is a floating-point type and the other isn't, we use
  the floating-point type.
  - Note this can result in massive loss of precision. A 64-bits unsigned
    integer can express a value as large as `18,446,744,073,709,551,615` with a
    precision of 1. But a `float` is much less precise around such large
    numbers. Floating points have many values around 0, and less and less as the
    values grow in absolute value. 

We'll need some new [literals](03-types.html#literals) to express these 64-bit
unsigned integers. Let's introduce them now:

- `long` is an integral type defined over as many or more Bytes than an `int`.
  Because of this it is considered of a "higher order" for conversion. That is,
  we consider it could be wider, even if it isn't. The literal for it uses the
  `l` suffix (which can be used along with the `u` suffix for `unsigned long`):
  `-42l`.
- `long long` is another distinct integral type defined over as many, or more
  Bytes than a `long`. The literal for it uses the double `ll` suffix (which can
  be used along with the `u` suffix for `unsigned long long`): `42ull`. While it
  is not guaranteed to be any specific size beside being as wide or wider than
  `long`, in modern architectures, it is usually 64 bit long.


```playground: Large int to float
id: arithmetic-int-to-float
height: 10
boilerplate_before: |
  #include <iostream>
  #include <iomanip>
  int main()
  {
    auto r {
boilerplate_after: |
  };
  std::cout << std::setprecision(999) << r << "\n";
  unsigned long long rull = r;
  long long diff = rull - 18446744073709550000ull;
  std::cout << "This is " << std::abs(diff) <<
    (diff>0?" \033[31m\033[4mmore\033[24m\033[0m" : " less") <<
    " than 18446744073709550000.\n";
  }
default_code: |
  18446744073709550000ull - 500000000.0f
```

This gives a whole new meaning to "less is more". Let's unpack what happens
there:
- Since `500000000.0f` is a `float`, `18446744073709550000ull` is converted to
  `float`.
- But `18446744073709550000` is not representable in `float`. So far away from
  `0`, the single precision floating point values are `1099511627776` apart!
- The representable values closest to `18446744073709550000` are
  - `18446742974197923840` below (1099511626160 less),
  - `18446744073709551616` above (1616 more).
- Of course, `18446744073709551616` is the closest candidate.
- Our operation is now using two `float` operands and has become:
  `18446744073709551616.0f - 500000000.0f`
- The result of this subtraction is `18446744073209551616`, but that number is
  not representable as a `float` either. The representable values around it are
  the same than for our initial number:
  - `18446742974197923840` below (1099011627776 less),
  - `18446744073709551616` above (500000000 more).
- And the closest is `18446744073709551616`, so that's our result.

Try removing the `.0f` part from `500000000`, so that the conversion to `float`
doesn't happen.

---

<br/>Now, let's consider what happens with integral types.

If both operands are signed, or both are unsigned, the highest order type wins
(`long long` prevails over `long`, `long` prevails over `int`). Simple.

But if one type is signed, and the other is unsigned, it gets tricky.
- If the types have the same rank, or if the unsigned type outranks the signed
  type, we use the unsigned type,

```playground: Signed Unsigned
id: arithmetic-signed-unsigned
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout <<
boilerplate_after: |
  << "\n";
  }
default_code: |
  24u - 60
```

What happens here is an underflow. We try to represent a negative value with an
unsigned type. We can't and what happens is that the values wrap around: one
below 0 with unsigned integers wraps all the way to the maximum value it can
represent. In this case, 36 below 0 is 35 below the maximum value.

That was if the types had the same rank or if the unsigned type outranked the
signed type. What happens otherwise?
- If the signed type is wide enough that it can represent all the values of
  the unsigned type (and more), then the signed type is used. That's a relief!
- Otherwise, both operands are converted to the unsigned type with the same size
  as the signed operand type. That is, to the unsigned type as wide as the
  operand with the highest rank.

That's a lot to digest, but I would not recommend learning this by heart. The
main idea to keep from this is that mixing different types can have unforeseen
consequences.
````
````aside> If you wonder "why?"
Why so convoluted and complex rules? That's a fair question.

The reasons boil down to only a few points.
- Floating point and integral arithmetic are completely different instructions
  on the processor, reading from completely different registers (the stone
  vessels on the apprentice's desk). Like water and oil, they don't mix, so we
  have to pick a side. The floating-point side makes more sense because it
  favours small values, which are more common than super large values.
- What happens when an integer grows beyond its defined values
  (underflow/overflow) is well defined for unsigned integers (it wraps around),
  but Undefined Behaviour (potentially a crash) for signed integers. So we
  prefer unsigned over signed to avoid the Undefined Behaviour.
- Finally, the reason for promoting small types to larger one has a bit of
  history. Long ago, processors could not perform operations on small types at
  all, so that was the only way. More recent processors can perform these
  operations, but if it was done that way that would be slower. Finally,
  nowadays, the compiler is clever enough to decide how to manage the operation,
  and will sometimes use the processor's ability to perform the operations on
  smaller types, or now, whichever is most efficient.

Another interesting question would be: how do other language handle this?

The same hardware limitations apply to other languages. There are roughly 3
categories of solutions for this:
- Languages like Rust, Swift, Go, will simply forbid such mix and match
  operations. You have to convert the operands to compatible types yourself, or
  it won't compile.
- Languages like Java and C# allow only widening, safe conversions: from 32 bit
  to 64 bit.
- Scripting languages like Python, JavaScript, or Ruby will scramle to hide this
  complexity entirely. For instance, Python uses arbitrary precision. That's
  nice, but that comes at a hefty performance cost.

So, in the end, this complexity makes sense for C++, where you only pay for what
you use. Taking the Rust approach can be done as a programmer's discipline:
never mixing types in arithmetic operations, to avoid surprises.
````
`````

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
  `0x00ff00ff` (only the bits differing between both operands are kept)
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
- `!` is the unary "not" operator. It changes `true` into `false`, and `false`
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
May 2020', fine. But being born on the same day doesn't make two children the
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
