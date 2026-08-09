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
the specific frequency of a musical note, the distance between threads on a
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

On a typical architecture, these 5 types are strictly the same thing from the
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
- `std::uint64_t` is an eight Bytes unsigned integral value.
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

The very point of the x64 architecture is to support larger data-types than
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
- If we write `163`, the value is of type `int`<br/>(the same bits interpreted as
  unsigned integer read as `163`).
- If we write `163u`, the value is of type `unsigned int`<br/>
  (the same bits interpreted as unsigned integer read as `163`)
- If we write `163.0`, the value is of type `double`<br/>
  (the same bits interpreted as unsigned integer read as `4639939069214720000`).
- If we write `163.0f`, the value is of type `float`<br/>
  (the same bits interpreted as unsigned integer read as `1126367232`).
- If we write `'£'`, the value is of type `char`<br/>
  (the same bits interpreted as unsigned integer read as `163` with Windows-1252
  or ISO-8859-1 encoding, or `153` with CP437 encoding).
- `true` and `false` are special values of type `bool`<br/>
  (with underlying values `1` and `0` respectively, although any non-zero value
  is interpreted as `true`).
```

This might be intimidating at first, but it is actually somewhat convenient:
note that we wrote what we meant, mostly.
It allows us to pretty much ignore the underlying representation and its
potential complexity.

Since a `char` should be interpreted through the ASCII lens, `'£'` is much
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

This is not a bug of a language but a feature. A core-design principle of C++
is: "Pay for what you use".

Maybe we will set the values of these variables later, from the user input, and
thus, it doesn't matter which value they had initially. In this case, making the
effort of giving them a specific value to replace it later would have been
paying for something we don't use: wasteful.

If you want the variables to have a specific value (e.g. `0`), it is safer to do
so explicitly.
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

`uz` is the literal suffix associated with the type `std::size_t` since C++23.
If you use an older standard of C++ it may fail to parse. You can use `ul`
instead.

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
change, or a "read-only floating-point".

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
id: type-error-02
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


## Aggregates

In [this previous chapter](./?page=01-data#even-more-bytes), we have seen also
seen that some types of data are expressed using several distinct numbers. There
are different ways of representing these data types. For now, we will limit
ourselves to the simplest category: aggregates.

There are two main categories of aggregates: arrays and some specific kind of
class types.

### Arrays

An array is a sequence of a specific number of data-elements, all of the same
type. For instance: 3 `float`, or 250 `char`.

There are two ways of defining arrays.

#### "C-style" arrays

The built-in way is often called "C-Style" arrays. The syntax is of the form
`type[N]`.

For instance: `float[3]`, or `char[250]`.

`````pitfall
An oddity with this syntax is that when declaring a [variable](#variables) of
these types, the type splits and surrounds the variable name: `int myArray[5]`.

This is one of the two exceptions where the syntax for variables is not strictly
`type` then `identifier` (the other is function pointers, something we will see
later).

````aside > It can be fixed by using a type alias
If this exception bothers you, you can use a type alias to make it go away. A
type alias is simply a way to rename a type. There are two ways of doing it:
`typedef` and `using`. Here we will only look at the more modern `using` way.

The "C-style" array type can be aliased to a single-word type name with the
syntax `using AliasName = type`. From there the new alias can be used as
other type names, on the left of the variable identifier:

```cpp
using MyArrayTypeAlias = int[5];
MyArrayTypeAlias myArray;
```
````

The simplest way to avoid this problem is to use the modern syntax with
`std::array`.
`````


#### std::array

The modern way to declare an array is with `std::array<type, N>`. This second
form is more consistent and generally clearer.

For instance: `std::array<float, 3uz>`, or `std::array<char, 250uz>`.

````illus
```cpp
std::array<float, 3uz> my3DVector;
std::array<char, 250uz> aShortCharacterString {"Some words here."};
```

The [image type](./?page=01-data#image) we discussed previously was mainly formed
of many Bytes, each interpreted as light intensity. Our example image used 88
Bytes. We could declare:

```cpp
std::array<std::byte, 88uz> imageLightIntensityData;
```

````

#### Accessing the content of an array

We use the square brackets `[]` with an index between them to access the data
inside an array. Arrays are "0-indexed" in C++, which means that to access the
first element of an array, we use `[0]` (`[1]` to access the second).

After declaring:
```cpp
std::array<char, 250uz> aShortCharacterString {"Some words here."};
```

- `aShortCharacterString[0]` is the character `'S'`
- `aShortCharacterString[1]` is the character `'o'`
- `aShortCharacterString[15]` is the character `'.'`
- `aShortCharacterString[16]` is the special character `'\0'` (which indicates the
  end of a character string).

```aside: What is "Some words here."?
In the same way that `'A'` is a literal of type `char`, text in double quotes
such as `"A"` is a literal of type `const char[N]` when `N` is the length of the
text **+ 1**. The additional character is to store the special `'\0'` character
marking the end of the character string.

"Some words here." is thus a `const char[16]`. A read-only C-style, built-in
array type of 16 characters, with the first being `'S'`, and the last being
`'\0'`.
```

### class types

There are three different class types in C++. They can all be aggregates, but
are not always aggregates. But for now, we will look at one of the three, when
it is effectively an aggregate.

#### struct

With structures, we can define our own types, by packaging together several data
types.

The syntax goes like this:
```cpp
struct StructureName
{
    type member_identifier1;
    other_type member_identifier2;
    //...
};
```

````illus
We have seen how to represent characters with ASCII codes, but in this page,
characters also have a size, can use **bold** or *italic*, etc. We could create
a `struct` to encode this information:

```cpp
struct StyledCharacter
{
    char character;
    float size;
    bool bold;
    bool italic;
};
```

Now we can use this type:
```cpp
StyledCharacter myStyledCharacter;
```

We can also initialize it. There are several ways, but our preferred way of
initializing it would be:
```cpp
StyledCharacter myStyledCharacter
{
    .character = 'A',
    .size = 10.0f,
    .bold = true,
    .italic = false
};
```

This way of initializing it is called "designated initialization" and has been
introduced with C++20. If your compiler uses an older version, you can use
aggregate initialization instead:
```cpp
StyledCharacter myStyledCharacter
{
    'A',
    10.0f,
    true,
    false
};
```

It is more concise, but harder to read. To know that the second boolean value
indicates whether the character is in italic, the person reading the code needs
to know the exact structure of `StyledCharacter`, which is why we prefer the
designated initialization syntax.

Unfortunately, at this point, our program will not know how to display this new
type out-of-the-box. But we can access each member of the variable (character,
size, bold, italic) with the `.` syntax: `variable_identifier.member`:

```playground: Accessing members
id: accessing-members
boilerplate_before: |
  #include <iostream>
  int main()
  {
    struct StyledCharacter
    {
        char character;
        float size;
        bool bold;
        bool italic;
    } myStyledCharacter
    {
        .character = 'A',
        .size = 10.0f,
        .bold = true,
        .italic = false
    };
    auto getMember = [](StyledCharacter myStyledCharacter)
  {
    return \
boilerplate_after: |
  };
  std::cout << getMember(myStyledCharacter) << "\n";
  }
default_code: |
  myStyledCharacter.character;
```
````

````pitfall
When declaring a `struct`, or any other class type in C++, don't forget the `;`
at the end of the declaration:
```cpp
struct MyStruct
{
    int member1;
    char member2;
}; // <-- this semicolon is easy to forget
```
````

```pitfall> The size of a struct
While the size of an array is the size of the element the array stores
multiplied by the number of elements in the array (e.g.
`std::array<std::uint_16, 8>` stores 8 elements made of 2 Bytes each, so has a
size of 16 Bytes), it is not as straight-forward with `struct`s.

For reasons that we will explain in the next chapters, the compiler may
sometimes insert gap Bytes between members.

This is mostly invisible to the programmer, and not something you need to think
too hard about for now.
```

### Composing aggregates

Nothing prevents you from using arrays in structs and structs in arrays. That's
where we start being able to make real complex and rich types.

````illus
Consider our image type. We saw that an array is convenient to store the light
intensity data as a `std::array<std::byte, 88uz>`, for instance.

But we also discussed that to be able to interpret it correctly as an image, we
need to also store the width and height of the image. It would be convenient to
store them alongside the light intensity bytes:
```cpp
struct GrayscaleImage
{
    std::size_t width;
    std::size_t height;
    std::array<std::byte, 88uz> lightIntensityData;
};
```

The array size is `88` because our image was 11 pixels wide and 8 pixels high.
Now that we store a size alongside, we could now use a larger buffer, allowing
for different image sizes. For instance:
```cpp
struct GrayscaleImage
{
    std::size_t width;
    std::size_t height;
    std::array<std::byte, 1024uz> lightIntensityData;
};
```
This would allow to store images of any size as long as `width`&times;`height`
remains lower or equal to 1024 (e.g. 32&times;32, 128&times;8, 4&times;64,
8&times;8, ...).

But what if our image was a colour image? Or even a colour image with
transparency?
One way would be to declare a `struct` encoding all the information for one
pixel of the image:
```cpp
struct PixelData
{
    std::uint8_t redIntensity;
    std::uint8_t greenIntensity;
    std::uint8_t blueIntensity;
    float transparency;
};
```

and then to store an array of this data structure in our image type:
```cpp
struct ColourImage
{
    std::size_t width;
    std::size_t height;
    std::array<PixelData, 1024uz> pixels;
};
```

```aside > How to choose between array or struct when both are possible?
You may have noted that the size of the image (width/height) and the different
colour intensities (red, green, blue) have respectively the same type
(`std::size_t` for the image size, `std::uint8_t` for the colours). So we could
use an array for them.

That is true, we could. But I preferred not to. Why?

Because of the **semantic**. Reading `myImage.size[0]` or `myPixel[1]` is
ambiguous: is it the width or the height? Are we sure it is the green component?

By using a `struct` instead, we remove the ambiguity and make it easier to read:
`myImage.width`, `myImage.height`, `myPixel.greenIntensity`. Avoiding situations
where the reader has to memorize a lot of information to figure out the code is
very important to make good-quality code.
``` 

Note that we could also do it the other way around: we could in the image store
an array of red colour intensities, then an array of green colour intensities, then
an array of blue intensities, and finally an array of transparencies.

It would change the order in which the data is written, but would also work. The
distinction between these two solutions is often referred to as AoS (Array of
Structures) for the first, and SoA (Structure of Arrays) for the second.

````

### Styled Text

Here is a simple `StyledCharacter` type:
```cpp
  struct StyledCharacter
  {
    char character;
    bool bold;
    bool italic;
  };
```

- First, declare and initialize a single `StyledCharacter` named `myStyledChar`.
- Second, make an array of `StyledCharacter` and name if `myStyledString`.

C++ would not know how to format a `StyledCharacter` out-of-the-box. It works
here because of hidden code handling it.

There will be help below the exercise.

```playground
id: styled-text
boilerplate_before: |
  #include <array>
  #include <iostream>

  struct StyledCharacter
  {
    char character;
    bool bold;
    bool italic;
  };

  void printStyled(const StyledCharacter& sc)
  {
    if (sc.bold)   std::cout << "\x1b[1m";
    if (sc.italic) std::cout << "\x1b[3m";
    std::cout << sc.character << "\x1b[0m";
  }

  template<size_t N>
  void printStyled(const StyledCharacter (&styledString)[N])
  {
    for(size_t i = 0; i < N; ++i)
    {
        printStyled(styledString[i]);
    }
  }

  template<size_t N>
  void printStyled(const std::array<StyledCharacter, N>& styledString)
  {
    for(size_t i = 0; i < N; ++i)
    {
        printStyled(styledString[i]);
    }
  }

  struct Exo
  {

boilerplate_after: |
  };

  template <typename T>
  concept HasMyStyledCharacter = requires(T t) {t.myStyledCharacter;};

  template <typename T>
  concept HasMyStyledString = requires(T t) {t.myStyledString;};

  template <typename T>
  void processExo(T exo)
  {
    static constexpr bool hasMyStyledCharMember = HasMyStyledCharacter<Exo>;
    static constexpr bool hasMyStyledStringMember = HasMyStyledString<Exo>;
    if constexpr(hasMyStyledCharMember)
    {
        printStyled(exo.myStyledCharacter);
        std::cout << "\n";
    }
    if constexpr(hasMyStyledStringMember)
    {
        printStyled(exo.myStyledString);
        std::cout << "\n";
    }
    if constexpr(!hasMyStyledCharMember && !hasMyStyledStringMember)
    {
        std::cout << "No member named `myStyledCharacter` or `myStyledString` found.\n";
    }
  }

  int main()
  {
    Exo exo;
    processExo(exo);
    return 0;
  }

default_code: |
  StyledCharacter myStyledCharacter {
    .character='A',
    .bold=false,
    .italic=true
  };
```

