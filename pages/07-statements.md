---
title: "07 — Statements"
prev: "06-expressions"
next: "08-functions"
---

# 07 - Statements

If [expressions](06-expressions.html) are the "verbs" in our code (they specify
what happens to the data in the program), **statements** are the sentences: a
self-standing structure expressing a complete instruction for the program.

## Declaration statements

We have already seen declaration statements without naming them when we
introduced the [variables](03-types.html#variables), and
[aggregates](04-aggreates.html).

```cpp
int i;
float f {7.5f};
std::array<char, 256UZ> string {"Hello there."};
```

Note that the initialisation part of a declaration can hold an expression (but
not a statement):

```cpp
int width {256};
int height {512};
size_t size {width * height};
```

Note that it is possible to declare several variables in one statement.

```cpp
int i, j, k;
int width {256}, height {512};
```
We show this notation here because it is not uncommon, but we will limit its
usage to simple cases as in this example, because more elaborate usage can
become confusing. We'll get back to these sharp edges in a couple of chapters.

Variables have a **scope**, but we'll get to it in a minute.

## Expression statements

An [expressions](06-expressions.html) followed by a semicolon `;` is an
expression statement. It is both one of the simplest and most used type of
statements.

```cpp
int i, j{25};
i += 42 * j - 3;
```
The code above shows a declaration statement followed by an expression
statement.

## Compound statements

A compound statement is one statement that groups any number of statments. It
wraps the statements it groups between curly braces `{` `}`.

```cpp
{
  int i;
  i = 5;
  i += 3;
  i %= 4;
}
```

This is a single compount statement (wrapping one declaration statement and 3
expression statements as one group).

### Variable scope

We mentioned in passing earlier that variable have a scope. The scope of a
variable defines where it can be accessed from, where its name is known.

A compound statement, also sometimes called a *block* introduces a new variable
scope. What that means is that variables introduced inside the compound
statement will "go out of scope" at the end of the compound statement. They may
or may no longer exist, but we can no longer call their name.

```playground: Variable Scope
id: variable-scope
height: 230
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  }
default_code: |
  int a {1};

  {
    int b {2};
    int c {3};
    a = b + c;
  }

  c = 2;
```
The code above fails with an error. The error says that `c` was not declared in
this scope, and points at the last line `c = 2`.

This is because as `c` was declared inside a compound statement, its scope ended
with the closing of that compund statement `}`. After this, the name `c` no
longer refers to it.

Note that `a`, which was declared in the scope above, was reachable inside the
compound statement. Its scope spans the whole exercise block, so it is
accessible. You can change the last line to `a = 2;` and see that would work.

````pitfall: Name hiding
If we were to declare in the same scope, two variables with the same name, we
would face an error:

```playground: Variable Redaclaration
id: variable-redec
height: 100
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  }
default_code: |
  int a {1};

  int a {8};
```

But since the compound statement opens a new scope, we can declare inside of it
variables that have the same name as variables in the enclosing scope (as it is
no longer the same scope):

```playground: Variable Name Hiding
id: variable-name-hiding
height: 180
boilerplate_before: |
  #include <iostream>
  int main()
  {
boilerplate_after: |
  std::cout << a << "\n";
  }
default_code: |
  int a {1};

  {
    int a {8};
    a = 12;
  }
```

This is usually considered a **bad practice**, as it makes things quite
confusing.

Here, when the second variable `a` is introduced inside the compount statement,
it hides the first one. As long as this second variable `a` is in scope, the
name `a` will refer to it, making the first variable `a` inaccessible through
this name.

````


