---
title: "02 — Types"
prev: "01-data"
next: "03-processing"
---

# 02 - Types

In [this previous chapter](./?page=01-data), we have seen that the same value
can be interpreted in many different ways. The processor has no idea about this
and will operate on the values as it is told to, without consideration for what
these values represent (we will look into this in more details in the next
chapter).

Yet, getting this wrong would lead to potentially catastrophic failures, so
since the processor doesn't take care of it, someone or something else has to.
Different languages have different solutions for this. In C++, the compiler
helps the programmer keeping track of what values represent through its type
system.

## The C++ type system

The main job of this system is to prevent mistakes with how values should be
interpreted while avoiding excessive friction. The programmer remains in
control.

```principle
A Type is a compile-time attribute that keeps track of the size and semantic of
a category of values.
```

When specifying a value, the programmer is encouraged to also specify its type.
The compiler keeps track of this type throughout the lifespan of the value and
uses it to enforce some boundaries or warn the programmer about misuse or likely
transgressions.

C++ is **statically typed**, which means that these verifications happen once when
the application is built from the code (compile-time), and not during the
application's execution (runtime).

But this information is not only for the compiler's benefit. It is extremely
important for the programmer who writes or reads the code.

When a program mentions a `pitch`, it could be a short text introducing an idea,
the specific frequence of a musical note, the distance between threads on a
screw, a dark sticky polymer, or a football field. All these things can be
designated by the same name: "pitch", but have a different meaning, different
semantic, and thus should be interpreted differently.

The Type specifies the semantic (the meaning) and avoids ambiguities.

### Keeping track of the "semantic"

```illus: Example
- The type `char` means a Byte that should be interpreted as [an ASCII code for
  a character](?page=01-data#bytes-as-characters).
- The type `bool` usually means a single Byte, that should be interpreted as [a
  Boolean value](?page=01-data#bytes-as-true-false-on-off-yes-no-values).
- The type `std::int8_t` means a Byte that should be interpreted as [a signed
  integer](?page=01-data#signed-bytes).
- The type `std::uint8_t` means a Byte that should be interpreted as an
  [unsigned integer](?page=01-data#octet).
- The type `std::byte` specifically means a Byte without specifying a
  designated way of interpreting it and is used to mean a Byte as
  ["raw data"](?page=01-data#byte).
```

On an typical architecture, these 5 types are strictly the same thing from the
processor's point of view. But we should read their bits in very different ways.

In this case, the distinction between these types doesn't inform the processor
on how these values should be processed; it informs the programmer of how they
should be interpreted, and it informs the compiler of which of the processor
operations are valid on these values.

### Keeping track of the size

The type also encodes in the compiler the number of Bytes (the size) of the
value.

```illus: Example
- `std::uint8_t` is a single Byte unsigned integral value.
- `std::uint16_t` is a two Bytes unsigned integral value.
- `std::uint32_t` is a four Bytes unsigned integral value.
- `std::uint64_t` is a eight Bytes unsigned integral value.
```

In this case, in addition to carrying the information of how these values should
be read (as unsigned integral values), the type also encodes the minimal size
required to manipulate these values.

```pitfall> pitfall: types across different platforms
There is an important distinction to be made here: the type tells the compiler
the size of the value, but different compilers/architectures can give different
sizes to the same type.

A given compiler has to be consistent, but different compilers don't have to
agree.

For instance, the type `std::size_t` has a size of 4 Bytes on x86 architectures,
while it has a size of 8 Bytes on x64 architectures.

This remains consistent on the given architecture, but changes across
architectures. In other words, while the size of a type is known with certainty
by the compiler, it can sometimes be confusing for the programmer, and change
from one computer to another.

The *semantic* is our compass:

The mission of a `std::size_t` is to store the size (in Bytes) of pieces of
data. It guarantees to be large enough to encode the maximum size of any piece
of data on the given architecture.

The very point of the x64 architecture is to supports larger data-types than
x86, so it is only natural for `std::size_t` to differ between these two
architectures.
```

## There is no value without a type

In C++, every value has a type, and this type cannot change throughout the
entire program.

### Literals

This type can be deduced from how we spell out the value. So we will have to be
a little careful.

```illus
- If we write `163`, the value is of type `int` (its underlying value is `163`).
- If we write `163u`, the value is of type `unsigned int` (its underlying value
  is `163`)
- If we write `163.0`, the value is of type `double` (its underlying value is
  `4639939069214720000`).
- If we write `163.0f`, the value is of type `float` (its underlying value is
  `1126367232`).
- If we write `'£'`, the value is of type `char` (its underlying value is
  `163`).
- `true` and `false` are special values of type `bool` (with underlying values
  `1` and `0` respectively).
```

This might be intimidating at first, but it is actually somewhat convenient:
note that we wrote what we meant, mostly.
It allows us to pretty much ignore the underlying representation and its
potential complexity.

Since a `char` should be interpreted through the ASCII lense, `'£'` is much
clearer than `163`.

By writing 163 as `163.0`, we made it clear that we minded the decimal part, and
that the correct representation would be a floating-point. And that saved us the
headache of figuring out the underlying representation which is very complex.

For the most part, we don't have to worry too much about the underlying value:
the C++ compiler takes care of this for us, as long as we don't stray from its
protecting embrace.

```aside> Why going over these underlying values, then?
The reason we didn't skip directly to this way of writing values with a type and
the interpretation handled for us by the compiler is two-fold:
- This is very much the philosophy of this course: we build everything from the
  very ground up. We appreciate the work the compiler does for us only when we
  are aware of it. We build an understanding first and only then use the tools
  that hide or ease this complexity.
- These underlying values are important in several contexts. Knowing about them
  will give us more options and more tools to understand and explain otherwise
  puzzling situations. Beyond having some applications when debugging, it points
  us in the right direction to understand semantics.
```

Note that in the most common architectures, `163`, `163u`, and `163.0f` will have
a size of 4 Bytes, while `163.0` will take 8 Bytes, and `'£'` only 1 Byte. It
will be important to be aware of these differences when we try to make our
programs efficient.

### Variables

A variable is a placeholder value. Instead of giving the value directly (`42`),
we use a label, representing that value. And since there is no value without a
type, we have to attach a type to this label as well.

The *syntax* to do so follows this pattern:

```cpp
type label;
```

The technical term for the label is "identifier", but we often call it the
variable's "name".

````illus
```cpp
char firstLetter;
bool isUppercase;
std::uint8_t alpha;
```
````

````pitfall
Note that we have given these 3 variables a type and an identifier, but no
value. This is absolutely fine to do so, but it is important to know that when
we do that, in some cases, the variables will have **any value**.

```aside> Some cases?
Understanding in which cases is beyond the scope of this lesson. We'll detail
this later when we have the building blocks to express these conditions.

If you really want to jump ahead, you can lookup the part of [this page](https://en.cppreference.com/cpp/language/default_initialization)
where it says "no initialization is performed".
```

This is not a bug of a language but a feature. A core-design principe of C++ is:
"Pay for what you use".

Maybe we will set the values of these variables later, from the user input, and
thus, it doesn't matter which value they had initially. In this case, making the
effort of giving them a specific value to replace it later would have been
paying for something we don't use: wasteful.

If you want the variables to have a specific value (e.g. `0`), it is safer to do
so explicitely.
````

We can also give an initial value to our variable when we define it. We call
this operation *initialization*. The syntax becomes:

```cpp
type label {value};
```

There are other ways to initialize variables, so don't be too surprised if you
see something different in C++ code you read elsewhere.

````illus
```cpp
char firstLetter {'@'};
bool isUppercase {true};
std::uint8_t alpha {42u};
```
````

#### Varying variables

Variables are labels for values, but sometimes, values can change over time.
Suppose we read a file, and consider the line of the file we are currently
reading. It is a value that will increase as we progress through the file.

````illus
```cpp
std::size_t currentLine {0};
// Further in the program we could change that value.
// For instance when we reach the 10th line:
currentLine = 10uz;
```

We define the variable `currentLine`, with the type `std::size_t`, and
initialize it to `0`. Later, we change its value to `10`.

Note that we don't reiterate the type of `currentLine` when we change its value.
Since the type never changes, it would be redundant. 
````

Assigning a different value with `=` is only one way of varying the value a
variable stands for. We will see other ways later.

#### Constant variables

Conversely, some values never change. Suppose I define the variable `pi`, for
instance:

```cpp
float pi {3.14159265f};
```

It would be odd to later change its value. It would likely be a mistake.

The type system gives us a tool to guard against such mistakes: we can declare
that `pi` is meant to never change, to be constant, using the keyword `const`.

```cpp
const float pi {3.14159265f};
```

Remember how the syntax is `type identifier {value};`? Now, the type of `pi` is
`const float`, which means it is a floating-point value that is meant to never
change, or a "read-only floatin-point".

```aside> constexpr
`constexpr` is a different keyword in C++. Contrary to `const`, `constexpr` is
not part of the type of the variable, but it implicitely makes the variable's
type `const`.

`const` tells that the variable should never change after its initialization.
`constexpr` says something more: not only should it never change after
initialization, but also, we know the value it will be initialized with ahead of
time (at compile time, specifically).

Suppose that in a program, we ask for the name of the user. It cannot be known
ahead of time, so we can store this data in a `const` variable but not in a
`constexpr` variable.

But `pi` is known ahead of time, and could (should) be stored in a `constexpr`
variable rather than "only" a `const` one.

`constexpr float pi {3.14159265f}` is equivalent to `constexpr const float pi
{3.14159265f}` (so we usually write the first because it's more concise). In
both cases, the type of `pi` is `const float`. 
```

## In practice

First and example where we do things properly. If you press "Run", it should
say: `This compiled and ran without error.`.

```playground: Working example
id: type-no-error
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  std::cout << "This compiled and ran without error.";
  }
default_code: |
  char c {'A'};
  int i {163};
  float f {163.5f};
  bool b {true};
```

But if we attempt to do nonsensical things, like initializing a character from a
number or an integral number from a floating point, or a 4-Byte floating point
from a value it cannot hold, or a boolean from a number, the compiler stops us.

```playground: Compilation error — narrowing
id: type-error-01
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  std::cout << "This compiled and ran without error.";
  }
default_code: |
  char c {163};
  int i {163.5f};
  float f {1e50}; // 1 * 10^50
  bool b {163};
```

It stops us if we attempt to modify a variable we have indicated as being
constant.

```playground: Compilation error — enforcing constness
id: type-error-01
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  std::cout << "This compiled and ran without error.";
  }
default_code: |
  const float pi {3.14159265f};
  pi = 42.f; // <- oops, not a good idea.
```


## struct/class
