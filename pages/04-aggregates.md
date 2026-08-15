---
title: "04 — Aggregates"
prev: "03-types"
next: "05-processing"
---

# 04 - Aggregates

In [this previous chapter](02-data.html#even-more-bytes), we have seen also
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
`Type[N]`.

For instance: `float[3]`, or `char[250]`.

`````pitfall
An oddity with this syntax is that when declaring a
[variable](03-types.html#variables) of these types, the type splits and
surrounds the variable name: `int myArray[5]`.

This is one of the two exceptions where the syntax for variables is not strictly
`Type` then `identifier` (the other is function pointers, something we will see
later).

````aside > It can be fixed by using a type alias
If this exception bothers you, you can use a type alias to make it go away. A
type alias is simply a way to rename a type. There are two ways of doing it:
`typedef` and `using`. Here we will only look at the more modern `using` way.

The "C-style" array type can be aliased to a single-word type name with the
syntax `using AliasName = Type`. From there the new alias can be used as
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

The modern way to declare an array is with `std::array<Type, N>`. This second
form is more consistent and generally clearer.

For instance: `std::array<float, 3uz>`, or `std::array<char, 250uz>`.

````illus
```cpp
std::array<float, 3uz> my3DVector;
std::array<char, 250uz> aShortCharacterString {"Some words here."};
```

The [image type](02-data.html#image) we discussed previously was mainly formed
of many Bytes, each interpreted as light intensity. Our example image used 88
Bytes. We could declare:

```cpp
std::array<std::byte, 88uz> imageLightIntensityData;
```

````

#### Initialising an array

As for other types, a good way to initialise an array is by using the curly
brackets `{}`. To initialise an array with multiple elements, we separate them
with commas `,` in the brackets:

```cpp
int cStyleArray[5] {0, 1, 2, 3, 4};
std::array<float, 5> modernArray {4.5f, 3.5f, 2.5f, 1.5f, 0.5f};
```

````aside: Arrays of char
We saw earlier that the compiler deduces the type of values from their specific
format (the [literals](03-types.html#literals)). There is such a literal for character
strings: `"Writing between double quotes"`.

This literal has the type of a read-only array of characters: `const char[N]`,
where `N`is the length of the text **+ 1**. The additional character is to store
the special `'\0'` character marking the end of the string.

If the UTF-8 encoding is used and the string contains special characters, its
length can be more than the number of characters.

The type of `"Hello, world!"` is `const char[14]` (13 characters + `'\0'`).

With UTF-8, the type of `"99¢"` is `const char[5]` (2 characters for
`99` + 2 characters for `¢` + `'\0'`).

Arrays of characters can also be initialized from such literals:
```cpp
std::array<char, 5> myWord {"here"};
```
It is equivalent to:
```cpp
std::array<char, 5> myWord {'h', 'e', 'r', 'e', '\0'};
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
    Type memberIdentifier1;
    OtherType memberIdentifier2;
    //...
};
```

Each element of the `struct` is called a member, and is like a variable inside
the variable, with its type and its identifier.
````illus
We have seen how to represent characters with ASCII codes, but in this page,
characters also have a size, can use **bold** or *italic*, etc. We could create
a `struct` to encode this information:

```cpp
struct StyledCharacter
{
    char character;
    float fontSize;
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
    .fontSize = 10.0f,
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
fontSize, bold, italic) with the `.` syntax: `variableIdentifier.member`:

```playground: Accessing members
id: accessing-members
boilerplate_before: |
  #include <iostream>
  int main()
  {
    struct StyledCharacter
    {
        char character;
        float fontSize;
        bool bold;
        bool italic;
    } myStyledCharacter
    {
        .character = 'A',
        .fontSize = 10.0f,
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
`std::array<std::uint16_t, 8>` stores 8 elements made of 2 Bytes each, so has a
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
store them alongside the light intensity Bytes:
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
This would allow storing images of any size as long as `width`&times;`height`
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

Because of the **semantics**. Reading `myImage.size[0]` or `myPixel[1]` is
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

Here is a simple `Colour` struct:
```cpp
struct Colour
{
    std::uint8_t red;
    std::uint8_t green;
    std::uint8_t blue;
};
```

And here is a `StyledCharacter` type that uses it:
```cpp
struct StyledCharacter
{
    char character;
    bool bold;
    bool italic;
    Colour colour;
};
```

- First, you will find a single `StyledCharacter` named `myStyledCharacter`
  declared and initialized. You can `Run` the execution or modify it.
- Second, you can make an array of `StyledCharacter` and name it
  `myStyledString`. If you initialize it with multiple `StyledCharacter`s, they
  will be displayed as a character string.
- What happens if you don't initialize it?

C++ would not know how to format a `StyledCharacter` out-of-the-box: it is our
own custom type. It works here because of hidden code handling it.

There will be help below the exercise.

```playground
id: styled-text
height: 540
boilerplate_before: |
  #include <array>
  #include <cstdint>
  #include <iostream>

  struct Colour
  {
    std::uint8_t red;
    std::uint8_t green;
    std::uint8_t blue;
  };

  struct StyledCharacter
  {
    char character;
    bool bold;
    bool italic;
    Colour colour;
  };

  void printStyled(const StyledCharacter& sc)
  {
    if (sc.bold)   std::cout << "\x1b[1m";
    if (sc.italic) std::cout << "\x1b[3m";
    std::cout << "\x1b[38;2;"
      << static_cast<int>(sc.colour.red) << ";"
      << static_cast<int>(sc.colour.green) << ";"
      << static_cast<int>(sc.colour.blue) << "m";
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
    .italic=true,
    .colour=Colour {
        .red=255,
        .green=0,
        .blue=0
    }
  };
```

````aside> Hint 1: How to declare an array?
For a built-in C-style array:
```cpp
Type identifier[N];
```

For a modern `std::array`:
```cpp
std::array<Type, N> identifier;
```
````

````aside> Hint 2: How to declare an array of StyledCharacters?
For a built-in C-style array:
```cpp
StyledCharacter myStyledString[5];
```

For a modern `std::array`:
```cpp
std::array<StyledCharacter, 5uz> myStyledString;
```
````

````aside> Hint 3: How to initialize an array of StyledCharacters?
One step at a time:
- Declare the variable
```cpp
std::array<StyledCharacter, 5uz> myStyledString;
// or StyledCharacter myStyledString[5];
```
- Then add curly braces `{}` to initialize it.
```cpp
std::array<StyledCharacter, 5uz> myStyledString {};
```
- What do we want to initialize it with?
  - Let's start with a first `StyledCharacter` element. But we have to
    initialize it as well, so let's give it curly braces too:
```cpp
std::array<StyledCharacter, 5uz> myStyledString { StyledCharacter {} };
```
<ul style="list-style-type: none;"><li><ul><li>What do we initialize the
`StyledCharacter` with?</li></ul></li></ul>

```cpp
std::array<StyledCharacter, 5uz> myStyledString {
  StyledCharacter {
    .character='A',
    .bold=false,
    .italic=false,
    .colour=Colour {}
  }
};
```
<ul style="list-style-type: none;"><li><ul style="list-style-type: none;"><li>
<ul><li>Colour is also a struct. Let's initialise it too.</li></ul>
</li></ul></li></ul>

```cpp
std::array<StyledCharacter, 5uz> myStyledString {
  StyledCharacter {
    .character='A',
    .bold=false,
    .italic=false,
    .colour=Colour {
      .red=128,
      .green=64,
      .blue=200
    }
  }
};
```

<ul style="list-style-type: none;"><li><ul><li>Next let's add a second
StyledCharacter:</li></ul></li></ul>

```cpp
std::array<StyledCharacter, 5uz> myStyledString {
  StyledCharacter {
    .character='A',
    .bold=false,
    .italic=false,
    .colour=Colour {
      .red=128,
      .green=64,
      .blue=200
    }
  },
  StyledCharacter {
    .character='B',
    .bold=false,
    .italic=true,
    .colour=Colour {
      .red=32,
      .green=120,
      .blue=200
    }
  }
};
```

````

````aside> Hint 4: What happens if we skip the initialization?
A fundamental design principle of C++ is "pay for what you use". The compiler
cannot guess whether you meant to initialise the variables and forgot, or
deliberately chose not to pay for their initialisation because you intended not
to use these initial values.

As such, the compiler sometimes lets you save the cost of initialising the variables by
skipping their initialisation. In such cases, the initial value of the variables
will **not** necessarily be `0`, but whatever was already in the memory. These
values are often referred to as "random", but it is not quite true. Calling them
"garbage" memory is more accurate.

Here we can see two cases:
- If the array has at least one value, all the missing values are still
  initialised by the compiler.
  - This also applies to the `colour` member variable: if left unspecified, it
    is still initialised to all `0`.
- If the array has no initialisation at all, it is uninitialised, and the
  characters, whether they are italic and/or bold, and their colours are all
  "garbage".

````

##
````recap
- In C++, every value (literals or variable) has a type.
- Aggregates are simple composite types grouping data together.
  - Arrays are fixed-size collections of the same type.
    - There is a built-in (C-style) and a modern way to make and use arrays.
  - `struct`s allow to structure different types together, naming each part.
  - Both can be composed together (Arrays of `struct`s, `struct` with an array
    member, arrays of `struct`s with array members...).
````
