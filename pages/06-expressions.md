---
title: "06 — Expressions"
prev: "05-processing"
next: "07-statements"
---

We have learned about [Types](03-types.html), and built a [simplified model of
the processor and its surrounding](05-processing.html). Now that we have the raw
material (data) and a workbench (the hardware), it is time to set things in
motion and start crafting.

# 06 - Expressions

### Expressions and statements

In C++, **expressions** are defined as "a sequence of operators and operands
that specifies a computation". In other words, they are the individual steps of
the recipes our apprentice (CPU) elaborates at the desk in the stone vessels
(registers).

**Statements**, on the other hand, are instructions for the program to do
something. In C++, the simplest form of statement is an expression followed by a
semicolon `;`.

- `1 + 1` is an expression that evaluates to `2`.
- `1 + 1;` is a statement that instructs the compiler to compute the expression
  above, and then throws that result away.

In this case, this statement will have no effect as nothing changed, but we will
soon see that many expressions modify the states of the program.

This chapter focuses on expressions. The next will look at statements.

## Homogeneous operations

There are many operations available. We will present some of them concisely, in
their simplest form where operands are of the same native type, then present
some subtleties.

### Arithmetic operations

`+`, `-`, `*`, `/` are relatively self-explanatory, although it is worth noting
that dividing two integral numbers results in an integral result.

```playground: Integral division
id: integral-division
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

In addition, we also get the `%` operator, called remainder or modulo operator.
It gives the remainder of a division: `11 % 3` is `2`, because 11 is 3&times;3 +
2. Note that it defines the sign of the result like a division operation would.
You can test it above.

````aside> For readers adept at binary: bitwise operators
There are also operators acting on the bitwise representation of the values.

C++ offers specific [literals](03-types.html#literals) to write numbers in
binary and hexadecimal, by prefixing the numbers by `0b` and `0x` respectively:
the number `12` in decimal can be written as `0b1100` in binary, or `0x0c` in
hexadecimal. For convenience, we will use numbers such as `0xffff0000` and
`0x00ffff00` for our examples. `0xf` corresponds to four consecutive 1s in
binary: `0b1111`.

- `~` is the unary operator for the "bitwise complement" operation: swapping all
  the 1s for 0s and all the 0s for 1s in the binary representation.
  `~0x00ffff00` is `0xff0000ff`.
- `&` is the bitwise AND operator: `0x0000ffff & 0x00ffff00` is `0x0000ff00`
  (only the bits present in both operands are kept).
- `|` is the bitwise OR operator: `0xff000000 | 0x000000ff` is `0xff0000ff` (any
  bit that is 1 in either operand is kept).
- `^` is the bitwise XOR operator (eXclusive OR): `0x0000ffff ^ 0x00ffff00`is
  `0x00ff00ff` (only the bits differing between both operands are kept)
- `<<` shifts the bits of the left-hand-side operand by the right-hand-side
  operand number of bits to the left: `0x0000ffff<<4` is `0x000ffff0`. The
  vacated bits are filled with 0s. Since C++20, left shift of negative numbers
  is well defined (it used to be Undefined Behaviour).
- `>>` shifts the bits of the left-hand-side operand by the right-hand-side
  operand number of bits to the right: `0x0000ffff>>4` is `0x00000fff`. The
  vacated bits are filled with 0s for unsigned ints and for positive signed
  ints, but with 1s for negative signed ints (so that the sign bit is kept).
  This is guaranteed since C++20.

````

### Logical operations

[Boolean values](01-data.html#bytes-as-true-false-on-off-yes-no-values) have
their own operators:
- `&&` is the "and" operator. It evaluates to `true` only when both operands are
  `true`.
- `||` is the "or" operator. It evaluates to `true` if any operand is `true`.
- `!` is the unary "not" operator. It changes `true` into `false`, and `false`
  into `true`.

```playground: Logical operations
id: logical-operations
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << ((
boilerplate_after: |
  )?"true":"false") << "\n";
  }
default_code: |
  true || false
```

````aside> Logical operations "short-circuit"
The one thing to note about these operators is that they "short-circuit":
- When evaluating an "or" operation `||`, since if either operand is `true`, the
  expression evaluates to `true`, the first operand (left-hand side operand) is
  evaluated, and if it is `true`, the evaluation stops there, returning `true`.
  Only if it is `false` is the second (right-hand side operand) evaluated.
- Similarly, when evaluating an `and` operation `&&`, if either operand is
  `false`, the expression evaluates to `false`. So the second operand
  (right-hand side) is only evaluated if the first one (left-hand side)
  evaluates to `true`.
````

### Comparison operations

Values can also be compared. We use `==` (equal), `!=` (not equal), `<`
(strictly less), `>` (strictly greater), `<=` (less or equal), and `>=` (greater
or equal). All of these operations evaluate to a
[boolean](01-data.html#bytes-as-true-false-on-off-yes-no-values) for native
types.

```playground: Comparison operations
id: logical-operations
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << ((
boilerplate_after: |
  )?"true":"false") << "\n";
  }
default_code: |
  207 >= 42
```

Note that a single `=` sign is an assignment and not a comparison.

`````aside> The <=> spacecraft operator

While the comparison operators presented above are relatively self-explanatory,
the semantics (specific meaning) of these operations can sometimes be ambiguous.

- The unambiguous case would be what we call **"strong ordering"**. This is when
  we can order all the elements, and when two elements are equal, they are
  indistinguishable. 

````illus: Strong ordering
Remember our [light intensities](01-data.html#bytes-as-light-intensity)? Given
two different light intensity values (`197` and `63`), the order is obvious (`63
< 197`). And if two pixels of an image have the same light-intensity value,
that's genuinely the same light intensity: we can exchange them and the image is
unchanged.
````

- But sometimes, equality is not the same as being indistinguishable. This is
  what we call **"weak ordering"**.

````illus: Weak ordering
Suppose you compare children based on their Date of Birth. In most cases, the
ordering will be easy: the '29th of February 2020' comes before the '1st of
May 2020', fine. But being born on the same day doesn't make two children
indistinguishable. Returning to parents a child that lived the same number of
days as their own might not be good enough, some are bound to notice.
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

But then comes [Merzbow](https://en.wikipedia.org/wiki/Merzbow) (Masami Akita),
a Japanese artist known for his harsh noise music, and who uses a lot of white
and pink noise in his compositions. Now we have the opposite problem: white and
pink noise are "all frequencies at the same time".

<p align="center">
<strong>"What is the fundamental frequency of your piece?<br/>- Merzbow:</strong>
<br/><img src="imgs/origin-of-the-yes-meme.webp" alt="yes" width="100%" style="max-width:400px"/>
</p>

We could come up with more rules to make up an arbitrary ordering, but
objectively, they don't really compare with the other songs.
````

That's where the C++20 "three-way comparison  operator `<=>` comes in. It is the
all-in-one comparison: it answers at the same time whether the operands are
equal, less or greater, or in some case if they can't be compared (unordered).

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
different values. The former means that the operands represent the same thing,
interchangeable, while the latter only means they have the same rank in the
ordering.

```playground: Spacecraft operator
id: spacecraft-operator
height: 10
boilerplate_before: |
  #include <iostream>
  #include <string>
  #include <math.h>
  #include <limits.h>

  template<typename T>
  constexpr std::string_view CompToText(T v)
  {
    if constexpr(std::is_same_v<T, std::strong_ordering>)
    {
      if(v == std::strong_ordering::equal)
        return "std::strong_ordering::equal";
      else if(v == std::strong_ordering::less)
        return "std::strong_ordering::less";
      else if(v == std::strong_ordering::greater)
        return "std::strong_ordering::greater";
      else
        return "Error";
    }
    if constexpr(std::is_same_v<T, std::weak_ordering>)
    {
      if(v == std::weak_ordering::equivalent)
        return "std::weak_ordering::equivalent";
      else if(v == std::weak_ordering::less)
        return "std::weak_ordering::less";
      else if(v == std::weak_ordering::greater)
        return "std::weak_ordering::greater";
      else
        return "Error";
    }
    if constexpr(std::is_same_v<T, std::partial_ordering>)
    {
      if(v == std::partial_ordering::equivalent)
        return "std::partial_ordering::equivalent";
      else if(v == std::partial_ordering::less)
        return "std::partial_ordering::less";
      else if(v == std::partial_ordering::greater)
        return "std::partial_ordering::greater";
      else if(v == std::partial_ordering::unordered)
        return "std::partial_ordering::unordered";
      else
        return "Error";
    }
    if constexpr(std::is_same_v<T, bool>)
    {
      if(v) return "true";
      return "false";
    }
    return "Unsupported Type";
  }

  int main()
  {
    std::cout << CompToText(
boilerplate_after: |
  ) << "\n";
  }
default_code: |
  207 <=> 42
```
`````

### Assignment operations

Assignment operations are different from the operations we have seen so far
because they *modify* one of their operand.

We can't modify a [literal](03-types.html#literals) (`10` can't be changed to
become `42`), but we can modify a [variable](03-types.html#varying-variables).

The operator `=` is the assignment operator (remember that to evaluate whether
two values are equal, we use `==`). It is an operator that assigns the value on
its right-hand side to the left-hand side operand, and evaluates to that
left-hand side operand (with its new value).

```playground: Assignment operations
id: assignment-operations
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  std::cout << i << "\n";
  }
default_code: |
  int i {8};
  i = 42;
```

Just like `1 + 1` evaluates to `2`, `i = 42` evaluates to `42`, but also changes
the value of `i` along the way.

There are many other assignment operations in C++ such as: `+=`, `-=`, `*=`,
`/=`, and `%=`. `i += 3` is (roughly) equivalent to `i = i + 3`, and the others
follow the same pattern. Try them above. (The bitwise operations also have their
matching "assignment" variants: `&=`, `|=`, `^=`, `<<=`, and `>>=`).

### Increment and decrement operations

Finally, the operations C++ takes its name from. Increment and decrement
operations are somewhat similar to assignment operations, as they, too, modify
the variable they are applied to.

There are 4 such operations.
- Pre-increment (`++` before the variable name): it increments (adds one to) the
  variable it is applied to, and evaluates to the new value of the variable.
- Post-increment (`++` after the variable name): it increments (adds one to) the
  variable it is applied to, and evaluates to the old value of the variable.
- Pre-decrement (`--` before the variable name): it decrements (subtracts one
  from) the variable it is applied to, and evaluates to the new value of the
  variable.
- Post-decrement (`--` after the variable name): it decrements (subtracts one
  from) the variable it is applied to, and evaluates to the old value of the
  variable.

````illus
Suppose we have:
```cpp
int i {5};
```
- `++i` is the pre-increment operation on `i`. It changes `i` value to `6`, and
  evaluates to `6`.
  - It is similar to `i += 1`, which is similar to `i = i + 1`.
- `i++` is the post-increment operation on `i`. It changes `i` value to `6`, and
  evaluates to `5` (its value before the increment).
- `--i` is the pre-decrement operation on `i`. It changes `i` value to `4`, and
  evaluates to `4`.
  - It is similar to `i -= 1`, which is similar to `i = i - 1`.
- `i--` is the post-decrement operation on `i`. It changes `i` value to `4`, and
  evaluates to `5` (its value before the decrement).
````

And that's why C++ is called that: it is an "increment" over the C language.

### Ternary conditional operator and more&hellip;

C++ has a special operation that takes three operands. The first operator is a
condition, the second is the result of the operation if the condition evaluates
to `true`, and the third operator is the result of the operation if the
condition evaluates to false:

```playground: Conditional Operation
id: conditional-operation
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << (
boilerplate_after: |
  ) << "\n";
  }
default_code: |
  true?"Green":"Red"
```

Note the ternary conditional operator is an expression, not a statement. We will
see conditional statements soon. Also, only one of the selected operands,
between the second and third, is evaluated.

There are more operations available, and we will see more as we progress. You
might remember for instance [the subscript `[]`
operator](04-aggregates.html#accessing-the-content-of-an-array) to access
members of an array we saw previously. We'll come back to it later as well.

### Composing operations

Of course, we can compose these operations in many different ways. Operations
have priorities (precedence), and also an associativity direction (left-to-right
or right-to-left) for when the precedence isn't enough.

````illus
```cpp
5 + 6 * 2
```
Because multiplications have a higher precedence than additions, this is
interpreted as:<br/>`5 + (6 * 2)`.

```cpp
5 * 6 / 2 * 8
```
Multiplications and divisions have the same precedence, so we use associativity
instead. Multiplication and division have left-to-right associativity, meaning
that we group from the left to the right: `(((5 * 6) / 2) * 8)`.
````

For the operations we have presented here, the increment/decrement operations
come first in terms of precedence, along with the other unary operations.

Then multiplication, division and modulo, followed by addition and subtractions.

Comparison comes after, followed by the binary logical operations.

````pitfall: And has higher priority than Or
It is worth noting that the logical "and" `&&` has a higher priority than the
logical "or" `||` operation.

This means that `true || false && false` evaluates to `true`, as it is
interpreted as `true || (false && false)`.
````

The assignments come last. They use right-to-left associativity.

The best place to check precedences and associativity direction when in doubt is
not this course, but [a well trusted
reference](https://en.cppreference.com/cpp/language/operator_precedence).

While some priorities are well known, some are less known, and to avoid any
mistakes it is usually preferable to use parentheses `(` `)` where there is any
risk of ambiguity.

```playground: Composite expression
id: composite-expression
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << (
boilerplate_after: |
  ) << "\n";
  }
default_code: |
  (45 * 9) / 4 + 11
```

`````pitfall: Order of evaluation
While the precedence and associativity direction tell you how parts of an
expression are grouped, it does **not** tell you **in which order** the parts of
the expression will be **evaluated**.

And for a good reason: this order is not guaranteed at all. In other words,
unless otherwise specified, the compiler is free to evaluate any part of an
expression in whichever order it chooses to.

````illus
```cpp
int i {5};
int undefined;
undefined = ++i + i;
```

We can't know what value `undefined` will have with certainty.

We have 3 operations:
- `++` has the highest precedence.
- `+` has a lower precedence than `++`.
= `=` has the lowest precedence.

So we know that the expression will be grouped like this:<br/>
`undefined = ((++i) + i);`

We know for sure that it will **not** be grouped like this:
- ~~`(undefined = (++i)) + i`;~~
- ~~`undefined = ++(i + i);`~~

So it tells us what the operation is. But it **does not** tell us in which order
the part of the operation are evaluated.

- If `(++i)` is evaluated first, then it evaluates to `6`, and now `i` has the
  value `6`.
  - Then, when the other side of the `+` is evaluated, it is `i`, it evaluates
    to `6`.
  - `undefined` will be `12` at the end of the evaluation.
- If `i` is evaluated first, then it evaluates to `5`.
  - Then, when the other side of the `+` is evaluated, it is `(++i)`. It
    evaluates to `6`, and now `i` has the value `6`.
  - `undefined` will be `11` at the end of the evaluation.
- But it's even worse. It is not just `11` or `12`. It is Undefined Behaviour
  (UB). Which means that anything can happen.
  - It could evaluate to any value.
  - It could be ignored (no operation happens at all).
  - It could break the program downstream from there.
````

````aside> The assignment is not a problem here
The order in which the two operands of the assignment `=` are evaluated doesn't
matter here for two reasons:
- `undefined` doesn't change based on the order of evaluation, so whether it is
  evaluated first or last doesn't matter.
- Since C++17, the assignment is guaranteed to evaluate the right-hand side
  before evaluating the left-hand side. So this very specific order of
  evaluation is guaranteed.
````

This only happens because the expression uses a value it mutates in multiple
places.

````principle
- If a value appears multiple times in an expression, it should not be mutated.
- If a value is mutated in an expression, it should not appear more than once.
````

`````

## Different operations for different types

Since different types should be interpreted differently depending on their
semantics (what they represent), they must also be processed according to their
nature.

````illus: Comparing signed or unsigned integral numbers
For instance, [signed integral numbers](01-data.html#signed-bytes) split their
range so that the upper half of their values is interpreted as negative numbers.

For integral numbers over a single Byte, what would be interpreted as `128` for
an unsigned number is interpreted as `-128` for a signed one, and what would be
`129` for an unsigned type is interpreted as `-127` for the signed one.

So if we are comparing `127` (which is `127` for both signed and unsigned) with
`129`/`-127`, we want the comparison to tell us that `127` is smaller in the
unsigned case (127 < 129), but larger in the signed case (127 > -127), despite
the underlying data being exactly the same.
````

Thankfully, the [typing system](03-types.html#the-c-type-system) already tracks
the type, and with it the semantics of our values. So we don't have to worry
about it: we say we want to perform an operation on the values, and the type
system will do the leg work to figure out which operation is appropriate.

As a simplified model, we could think about it this way:
- If we multiply two unsigned integral types, the compiler will use the unsigned
  integral multiplication (e.g. x86 `MUL`).
- If we multiply two signed integral types, it will use the signed integral
  multiplication (e.g. x86 `IMUL`).
- If we multiply two single-precision floating points (`float`), it will use the
  single precision floating point multiplication (e.g. x86 `MULSS`).
- If we multiply two double-precision floating points (`double`), it will use
  the double precision floating point multiplication (e.g. x86 `MULSD`).

But this can only work when the processor has in its silicon the specific
operation available. A processor provides a finite set of primitive operations,
and the compiler must express the language’s operations in terms of those
primitives.

### Heterogeneous operations

Usually, processors don't come with operations over mixed types. This is where
things can become more complicated and sometimes surprising.

#### Floating Point
For instance, floating-point numbers are typically handled in a different area
of the processor than other logical operations (different Execution Units). This
is in large part because of their [more complex
interpretation](01-data.html#bytes-as-floating-point).

Floating point operations even have to be performed over their very own
specialized registers (a specific set of stone vessels on the apprentice desk).

So what happens if we try to add or divide a floating-point number with an
integral one, or the other way around?

Since there are no mixed-type operation between floating point and integral, and
the available operations even use completely different registers, the processor
has to settle on a resolution.

In this case, there is a simple rule: when an operation mixes integral and
floating point types: The integral type operand is converted into the floating
point type.

````aside: How this rule is useful
We mentioned above that the division instructions the processor offers for
integral types results in integral types, which means it truncates the result to
the unit.

But now we know that if either of the operand is a floating-point, the compiler
will convert the other operand to the same floating-point and perform the
floating-point division instead.

```playground: Floating-point division
id: floating-point-division
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
  12 / 5.0F
```
````

````pitfall> How this rule can bite
As long as we use relatively small numbers, we are safe, because floating point
numbers are as or more precise than integral up to `16777216` for 32-bit
floating points. But past this point, not all integral numbers exist in the
floating-point representation. `16777217` cannot be represented as a 32-bit
floating point. The next value after `1677216.0f` is `16777218.0f`, and it
continues this way 2 by 2 until the next exponent, from which point it becomes 4
by 4, then 8 by 8, doubling with each subsequent exponent (see [Bytes as
floating point](01-data.html#bytes-as-floating-point-). On the other hand, the
integral values continue to grow 1 by 1 across their full range.

```playground: Large int to float
id: int-to-float
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
  long long diff = rull - 18446744073709550000ULL;
  std::cout << "This is " << std::abs(diff) <<
    (diff>0?" \033[31m\033[4mmore\033[24m\033[0m" : " less") <<
    " than 18446744073709550000.\n";
  }
default_code: |
  18446744073709550000ULL - 500000000.0F
```

This gives a whole new meaning to "less is more". Let's unpack what happens
there:
- Since `500000000.0F` is a `float`, `18446744073709550000ULL` is converted to
  `float`.
- But `18446744073709550000` is not representable in `float`. So far away from
  `0`, the single precision floating point values are `1099511627776` apart!
- The representable values closest to `18446744073709550000` are
  - `18446742974197923840.0F` (1099511626160 below),
  - `18446744073709551616.0F` (1616 above).
- Of course, `18446744073709551616.0F` is the closest candidate.
- Our operation is now using two `float` operands and has become:<br/>
  `18446744073709551616.0F - 500000000.0F`
- The mathematical result of this subtraction should be `18446744073209551616`,
  but that number is not representable as a `float` either. The representable
  values around it are the same as for our initial number:
  - `18446742974197923840.0F` (1099011627776 below),
  - `18446744073709551616.0F` (500000000 above).
- And the closest is `18446744073709551616.0F`, so that's our result.

Try removing the `.0F` part from `500000000.0F`, so that the operation is
between integral numbers, without a conversion to `float`.
````

#### Mixing Signed and Unsigned Integral

Contrary to floating-point, signed and unsigned integral types share the same
registers, but the problem remains: the processor offers instructions for
signed on signed operations, or for unsigned on unsigned operations, but not for
a mix of signed and unsigned. So the compiler will have to make a call between
going with the signed or the unsigned instruction.

Unfortunately, the rules determining which is picked are more complicated in
this case, and not as well-known as the rule for mixing floating-point and
integral types.

````principle
Avoid executing operations on values with different semantics, unless the
readers of your code are expected to know the rules governing their interaction.
````

The easiest solution is simply to avoid such situations, typically by explicitly
converting the operands into equivalent types so that the outcome is
unsurprising. We will see the conversion operations further down in this page.

````aside> Learning one more conversion rule for signed/unsigned integral

One rule that is worth knowing is that, in such mix, if the signed type is large
enough to represent all the values of the unsigned type (in addition to the
negative values it can represent as well), then the unsigned type is converted
in the signed type.

```playground: Integral Unsigned and Wide Signed
id: integral-unsigned-wide-signed
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
  50LL - 75U
```

This is safe in all architectures where a `long long` type (`50LL`) is 64-bit
and an `unsigned int` (`75U`) is 32-bit: the `unsigned int` will be converted
into a (signed) `long long` which can represent all its values (and much more),
and the result will be a signed `long long`.
````

````aside> The whole signed/unsigned integral story
Again, you don't need to learn these rules. Many C++ programmers don't know
them, or won't have them in mind while reading your code, so relying on them
will be confusing for no good reasons. It is best and free to avoid these
situations.

The main reason for looking into them is to be able to understand what happened
in situations where things would have gone wrong.

There are 3 rules for the signed/unsigned of integral types. One is explained in
the box above. Before we introduce the two remaining rules for signed/unsigned
integral mix, we need to explain the difference between a type "rank" and its
size.

Back when we introduced the [`long` and `long long`
types](03-types.html#aside-long-and-long-long), we said that the size of a
`long` is either the same or larger than the size of an `int`. This size is an
undisputable fact, but depends on the specific architecture. On the other hand,
without knowing the specific architecture, we know that `long` has the
*potential* to be wider than `int`, and never narrower. This potential is the
"rank". Similarly, since `long long` is as wide or wider than `long`, `long
long` has a higher rank than `long`.

Here are the two missing rules for signed/unsigned integral types:
1. If the types have the same rank, or if the unsigned type outranks the signed
  type, we use the unsigned type.

```playground: Unsigned outranks Signed
id: unsigned-signed
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
  24U - 60
```

What happens here is an underflow. We try to represent a negative value with an
unsigned type. We can't and what happens is that the values wrap around: one
below 0 with unsigned integers wraps all the way to the maximum value it can
represent. In this case, 36 below 0 is 35 below the maximum value.

2. The last case is when the signed type outranks the unsigned type, but is not
wide enough to represent all the unsigned values. This can happen because the
rank is independent from the architecture, while the size depends on it. So a
signed `long long` type outranks an `unsigned long` even if they are the same
size. In this case, both operands are converted into a new type: the unsigned
version of the signed type. In the `long long` and `unsigned long` case:
`unsigned long long`.

```playground: Signed outranks Unsigned
id: signed-unsigned
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
  24UL - 60LL
```

You might notice that in these two new cases, the unsigned type is preferred
over the signed type. This might seem strange at first, but we have to consider
a few things:
- If the signed type was preferred instead, a valid unsigned value could become
  unexpectedly negative.
- Overflow (going past the largest value) and underflow (going below the
  smallest value) of unsigned types is well defined in C++, while it is
  "Undefined Behaviour" (UB) for signed types.

````

### Sub-integer types

Sub-integer types designate the numeric types that are smaller than an `int`,
such as `bool`, `char`, `short`.

In part for historical reasons, C++ converts these types into `int` or `unsigned
int` before performing an arithmetic operation on them.

````aside> Why?
- Some old architectures could simply not perform some of these operations.
- Others could but would actually use the `int` instruction, which meant loading
  a sub-integer into part of the `int` register, and then zero-ing the part of
  the register the sub-integer type didn't occupy, then performing the
  operation.
- So historically, it made sense to avoid the problem entirely by promoting the
  values to the [word size](02-data.html#a-different-kind-of-word) before making
  calculations with them.
- Nowadays, modern CPUs can usually perform these operations, and wouldn't
  suffer from these issues as much, but the parallelisation happening inside the
  processor has introduced new headaches with these sub-integer types, making
  their native support complex and somewhat inconsistent.
- In addition, the compilers are clever enough to take liberties with how they
  translate the operations into machine code, and can skip the conversion in
  some places, bundle some values together in others, minding their business as
  they see fit under the "as if" rule of C++ (they are allowed to do what they
  want as long as the program behaves "as if" they followed the rules).
- Long story short, changing this rule now would be extraordinarily difficult
  because of all the C++ code that relies on this historical behaviour, and in
  addition, the benefit for modern architectures might not be worth it,
  especially considering that compilers have plenty of freedom to adapt the code
  to the architecture without revising the rule.

````

```playground: Sub-integer type promotion
id: sub-integer-promotion
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << (
boilerplate_after: |
  ) << "\n";
  }
default_code: |
  'a' + true
```

Both operands are converted to `int` before the addition is performed, and so
the result is also an `int`. This is another instance of the compiler resolving
operations by converting operands to a common type.

### Explicit conversion

The best way to stay on top of type conversions and to make your code easier to
read by others is to be *explicit* about your intent.

`static_cast` allows to change the type of a value into a different one, if the
conversion is possible. The syntax is a bit different from what we have seen so
far, with the target type between `<>` and the value between `()`:

````illus: static_cast
For instance, `static_cast<int>(512.7f)` will transform the value `512.7` (a
`float`) into an `int` (discarding the decimal part).
````

Whenever the type conversion happening in an operation are unclear, it will be
helpful to explicitly convert them to a common type resolving the ambiguity.
Some modern languages such as Rust enforce this as a rule, for instance.

Alternatively, we can also use the conversion rules to our advantage:

```playground: Explicit conversion
id: sub-integer-promotion
height: 10
boilerplate_before: |
  #include <iostream>
  int main()
  {
    std::cout << (
boilerplate_after: |
  ) << "\n";
  }
default_code: |
  12 / static_cast<float>(5)
```

Using [the floating-point conversion rule](#aside-how-this-rule-is-useful), by
explicitly converting one operand, we get a floating point result out of the
division between two integral values.

##
````recap
- Expressions are sequence of operators and operands that specifies a
  computation.
- Statements are instructions for the program.
- There are many different operations available in C++.
  - Only certain operations are available for certain types.
  - Some operations modify their operands.
- The compiler will change (convert, promote) the type of the operands in some
  cases:
  - When operations are performed on numeric types smaller than an int.
  - When operations are performed over operands of different types.
    - For arithmetic operations, when one operand is a floating-point type, the
      result will be a floating-point type as well.
  - To choose the type an expression evaluates to and to avoid confusing or
    unclear situation with implicit type conversions, `static_cast` allows to
    explicitly convert a value into a chosen type.
````
