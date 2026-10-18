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

It is possible to declare several variables in one statement.

```cpp
int i, j, k;
int width {256}, height {512};
```
We show this notation here because it is not uncommon, but we will limit its
usage to simple cases as in this example, because more elaborate usage can
become confusing. We'll get back to these sharp edges in a couple of chapters.

Variables have a **scope**, but we'll get to that in a minute.

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

### Null statements

Surprisingly enough, the expression in an expression statment is optional. Which
means this is a valid statement:

```cpp
;
```
We'll see both how it can be useful or hurtful shortly.

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

This is a single compound statement (wrapping one declaration statement and 3
expression statements as one group).

### Variable scope

We mentioned in passing earlier that variable have a scope. The scope of a
variable defines where it can be accessed from: where its name is known.

A compound statement, also sometimes called a *block* introduces a new variable
scope. What that means is that variables introduced inside the compound
statement will "go out of scope" at the end of the compound statement. They may
or may no longer exist, but eithre way, we can no longer call their name.

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
this name. After the compound statement ends, closing the scope at the `}`, `a`
reverts to referring to the first variable `a` declared at the first line, with
value `1`.

````

## Selection statements

### if statements

An `if` statement has two main parts:
- an expression condition,
- a conditional body statement that is executed only if the condition evaluated
  to `true`.

The condition must be placed between parenthesis `(` `)` that follow the `if`.
The condition is "contextually" converted to a boolean value. Instead of an
expression, it can also be a simple declaration statement.

The body statement that is executed only of the condition is `true` may
or may not be a compound statement. Either way, it introduces its own scope
(like a compound statement).

```cpp
if(a > 100)
  a -= 50;
```

Since C++17, the parenthesis after the `if` keyword can also hold an
initialisation statement before the condition expression. The point of this
initialisation statement is that it shares the same scope as the body statement.
It is habitually used to introduce new variables needed in the condition
expression, but not outside of the if statement. The initialisation statement
can only be an expression statement or a simple declaration statement.

```cpp
if(int calc{(a + b) / (c % d)}; calc > 10)
{
  result = calc * 3;
}
```
In this example, the initialisation statement allows to compute `calc` only once
and reuse its value in the conditional body statement, while keeping its scope
limited to the if statement.

### else clause

`if` statements can also have an `else` clause. The `else` clause has a
conditional body statement similar to the `if`'s. This statement is executed
only if the `if`'s condition expression evaluates to `false`.

```cpp
if(currentSpeed > 0)
 timeToDestination = distance / currentSpeed;
else
  timeToDestination = distance / minSpeed;
```

If several `if`/`else` are nested into each other, the `else` clause applies to
the `if` that is closest to it. One common pattern of such nesting happens when
a variable is tested against several conditions:

```cpp
if(a > 100)
  result = 'A';
else if(a > 50)
  result = 'B';
else if(a > 25)
  result = 'C';
else
  result = 'D';
```

In many cases it will be clearer to instead wrap any multi-line body statement
(from an `if`, an `else` or other) inside compound statements:

```cpp
if(a > 2)
{
  if(b < 5)
    result = 4;
  else
    result = 10;
}
else
{
  if(b < 12)
    result = 8;
  else
    result = 3;
}
```

### Branching

Selection statements act like railway switches. The execution "branches", as it
will follow a single path, and reject the others.

For a long time, this has been the bane of performances.

If we picture the operations the processor must process as a ribbon, the
processor doesn't opoerate one instruction at a time. It is a "pipeline", with
several operations being processed simultaneously inside the processor. To put
it another way, when one instruction enters the processor's pipeline, it starts
being executed, but we don't wait for that operation to complete to start on the
next instruction: as the first operation progresses inside the execution
pipeline, the next operations enter the pipeline and start their execution as
well.

<svg width="100%">
  <line x1="-20" y1="80" x2="760" y2="80" stroke="var(--text)"/>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="-20" to="40"></animate>
  </circle>
  <circle cx="40" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="40" to="100"></animate>
  </circle>
  <circle cx="100" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="100" to="160"></animate>
  </circle>
  <circle cx="160" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="160" to="220"></animate>
  </circle>
  <circle cx="220" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="220" to="280"></animate>
  </circle>
  <circle cx="280" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="280" to="340"></animate>
  </circle>
  <circle cx="340" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="340" to="400"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="var(--illus); color-mix(in lab, var(--illus) 83%, var(--illus-label) 17%)"></animate>
  </circle>
  <circle cx="400" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="color-mix(in lab, var(--illus) 83%, var(--illus-label) 17%)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="400" to="460"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="color-mix(in lab, var(--illus) 83%, var(--illus-label) 17%); color-mix(in lab, var(--illus) 67%, var(--illus-label) 33%)"></animate>
  </circle>
  <circle cx="460" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="color-mix(in lab, var(--illus) 67%, var(--illus-label) 33%)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="460" to="520"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="color-mix(in lab, var(--illus) 67%, var(--illus-label) 33%); color-mix(in lab, var(--illus) 50%, var(--illus-label) 50%)"></animate>
  </circle>
  <circle cx="520" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="color-mix(in lab, var(--illus) 50%, var(--illus-label) 50%)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="520" to="580"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="color-mix(in lab, var(--illus) 50%, var(--illus-label) 50%); color-mix(in lab, var(--illus) 33%, var(--illus-label) 67%)"></animate>
  </circle>
  <circle cx="580" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="color-mix(in lab, var(--illus) 33%, var(--illus-label) 67%)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="580" to="640"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="color-mix(in lab, var(--illus) 33%, var(--illus-label) 67%); color-mix(in lab, var(--illus) 17%, var(--illus-label) 83%)"></animate>
  </circle>
  <circle cx="640" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="color-mix(in lab, var(--illus) 17%, var(--illus-label) 83%)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="640" to="700"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="800ms" values="color-mix(in lab, var(--illus) 17%, var(--illus-label) 83%); var(--illus-label)"></animate>
  </circle>
  <circle cx="700" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus-label)">
    <animate attributeName="cx" repeatCount="indefinite" dur="800ms" from="700" to="760"></animate>
  </circle>
  <text x="520" y="35" fill="var(--text)" text-anchor="middle" font-size="large" font-weight="bold">CPU</text>
  <rect x="370" y="5" width="300" height="140" stroke="var(--muted)" stroke-width="5" fill="none"/>
</svg>

Without conditionals, without branching, this is way more efficient. The ribbon
of instruction doesn't pause when an instruction enters the pipeline until it
finishes to push the next, one step at a time. Instead, it crams instructions
continuously inside the pipeline.

But when a branch reaches the processor, this breaks down: we need to evaluate
the condition to know which branch to follow, what instruction to execute next.

In the past, what happened was that the whole ribbon would pause, wait for that
condition to traverse the whole pipeline, and then restart pushing instructions
from the correct branch in the now empty processor's pipeline.

<svg width="100%">
  <line x1="-20" y1="80" x2="760" y2="80" stroke="var(--text)">
    <animate attributeName="x1" repeatCount="indefinite" dur="12s" begin="0ms"
      values="-20; 370; 370; -20; -20" keyTimes="0; 0.4333; 0.7667; 0.7667; 1"/> 
  </line>
  <line x1="-20" y1="40" x2="-20" y2="40" stroke="var(--text)">
    <animate attributeName="x2" repeatCount="indefinite" dur="12s" begin="-11200ms"
      values="-20; 310; 310; -20; -20" keyTimes="0; 0.3667; 0.7; 0.7; 1"/> 
    <animate attributeName="y1" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="40; 40; 80; 40; 40; -20; -20"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 1"/>
    <animate attributeName="y2" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="40; 40; 80; 40; 40; -20; -20"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 1"/>
    <animate attributeName="stroke-opacity" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="1; 1; 0; 1; 1" keyTimes="0; 0.8278; 0.845; 0.85; 1"/>
  </line>
  <line x1="-20" y1="40" x2="-20" y2="80" stroke="var(--text)">
    <animate attributeName="x1" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="-20; 310; 310; -20; -20; 310; 310; -20; -20"
      keyTimes="0; 0.1833; 0.35; 0.35; 0.5; 0.6833; 0.8278; 0.8278; 1"/>
    <animate attributeName="x2" repeatCount="indefinite" dur="24s" begin="-12000ms"
      values="-20; 370; 370; -20; -20; 370; 370; -20; -20"
      keyTimes="0; 0.2167; 0.3833; 0.3833; 0.5; 0.7167; 0.8611; 0.8611; 1"/> 
    <animate attributeName="y1" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="40; 40; 80; 40; 40; -20; 40; 40"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 0.85; 1"/>
  </line>
  <line x1="-20" y1="120" x2="-20" y2="120" stroke="var(--text)">
    <animate attributeName="x2" repeatCount="indefinite" dur="12s" begin="800ms"
      values="-20; 310; 310; -20; -20" keyTimes="0; 0.3667; 0.7; 0.7; 1"/> 
    <animate attributeName="y1" repeatCount="indefinite" dur="24s" begin="800ms"
      values="120; 120; 80; 120; 120; 180; 180"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 1"/>
    <animate attributeName="y2" repeatCount="indefinite" dur="24s" begin="800ms"
      values="120; 120; 80; 120; 120; 180; 180"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 1"/>
    <animate attributeName="stroke-opacity" repeatCount="indefinite" dur="24s" begin="800ms"
      values="1; 1; 0; 1; 1" keyTimes="0; 0.8278; 0.845; 0.85; 1"/>
  </line>
  <line x1="-20" y1="120" x2="-20" y2="80" stroke="var(--text)">
    <animate attributeName="x1" repeatCount="indefinite" dur="24s" begin="800ms"
      values="-20; 310; 310; -20; -20; 310; 310; -20; -20"
      keyTimes="0; 0.1833; 0.35; 0.35; 0.5; 0.6833; 0.8278; 0.8278; 1"/>
    <animate attributeName="x2" repeatCount="indefinite" dur="24s" begin="0ms"
      values="-20; 370; 370; -20; -20; 370; 370; -20; -20"
      keyTimes="0; 0.2167; 0.3833; 0.3833; 0.5; 0.7167; 0.8611; 0.8611; 1"/> 
    <animate attributeName="y1" repeatCount="indefinite" dur="24s" begin="800ms"
      values="120; 120; 80; 120; 120; 180; 120; 120"
      keyTimes="0; 0.3278; 0.35; 0.35; 0.8278; 0.85; 0.85; 1"/>
  </line>
  <defs>
    <rect id="cond" x="-14" y="-14" width="28" height="28" transform="rotate(45)" />
  </defs>
  <use href="#cond" x="-20" y="80" stroke-width="1.5" stroke="var(--aside-label)" fill="var(--aside)">
    <animate attributeName="x" repeatCount="indefinite" dur="12s" begin="0ms"
      values="-20; 760; 760" keyTimes="0; 0.8667; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="12s" begin="0ms"
      values="
        var(--aside);
        var(--aside);
        color-mix(in lab, var(--aside) 83%, var(--aside-label));
        color-mix(in lab, var(--aside) 67%, var(--aside-label));
        color-mix(in lab, var(--aside) 50%, var(--aside-label));
        color-mix(in lab, var(--aside) 33%, var(--aside-label));
        color-mix(in lab, var(--aside) 17%, var(--aside-label));
        var(--aside-label);
        var(--aside-label)"
      keyTimes="
        0; 0.4333; 0.4889; 0.5444; 0.6; 0.6556; 0.7111; 0.7667; 1">
    </animate>
  </use>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="-20; 310; 310; 760; 760"
      keyTimes="0; 0.1833; 0.35; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.3278; 0.35; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="-20; 310; 310; 760; 760"
      keyTimes="0; 0.1833; 0.35; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-11200ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.3289; 0.35; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-10400ms"
      values="-20; 250; 250; 760; 760"
      keyTimes="0; 0.15; 0.3167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-10400ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.2944; 0.3167; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-10400ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-10400ms"
      values="-20; 250; 250; 760; 760"
      keyTimes="0; 0.15; 0.3167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-10400ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.2944; 0.3167; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-9600ms"
      values="-20; 190; 190; 760; 760"
      keyTimes="0; 0.1167; 0.2833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-9600ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.2611; 0.2833; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-9600ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-9600ms"
      values="-20; 190; 190; 760; 760"
      keyTimes="0; 0.1167; 0.2833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-9600ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.2611; 0.2833; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-8800ms"
      values="-20; 130; 130; 760; 760"
      keyTimes="0; 0.0833; 0.25; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-8800ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.2278; 0.25; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-8800ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-8800ms"
      values="-20; 130; 130; 760; 760"
      keyTimes="0; 0.0833; 0.25; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-8800ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.2278; 0.25; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-8000ms"
      values="-20; 70; 70; 760; 760"
      keyTimes="0; 0.05; 0.2167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-8000ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.1944; 0.2167; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-8000ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-8000ms"
      values="-20; 70; 70; 760; 760"
      keyTimes="0; 0.05; 0.2167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-8000ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.1944; 0.2167; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-7200ms"
      values="-20; 10; 10; 760; 760"
      keyTimes="0; 0.0167; 0.1833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-7200ms"
      values="40; 40; 80; 80"
      keyTimes="0; 0.1611; 0.1833; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-7200ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-7200ms"
      values="-20; 10; 10; 760; 760"
      keyTimes="0; 0.0167; 0.1833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="-7200ms"
      values="120; 120; 180; 180"
      keyTimes="0; 0.1611; 0.1833; 1"></animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-6400ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-6400ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-5600ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-5600ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="-4800ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="-4800ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
<!-- -->
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="800ms"
      values="-20; 310; 310; 760; 760"
      keyTimes="0; 0.1833; 0.35; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="800ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.3278; 0.35; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="800ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="800ms"
      values="-20; 310; 310; 760; 760"
      keyTimes="0; 0.1833; 0.35; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="800ms"
      values="40; 40; -20; -20"
      keyTimes="0; 0.3289; 0.35; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="1600ms"
      values="-20; 250; 250; 760; 760"
      keyTimes="0; 0.15; 0.3167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="1600ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.2944; 0.3167; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="1600ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="1600ms"
      values="-20; 250; 250; 760; 760"
      keyTimes="0; 0.15; 0.3167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="1600ms"
      values="40; 40; -20; -20"
      keyTimes="0; 0.2944; 0.3167; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="2400ms"
      values="-20; 190; 190; 760; 760"
      keyTimes="0; 0.1167; 0.2833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="2400ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.2611; 0.2833; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="2400ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="2400ms"
      values="-20; 190; 190; 760; 760"
      keyTimes="0; 0.1167; 0.2833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="2400ms"
      values="40; 40; -20; -20"
      values="120; 120; 180; 180"
      keyTimes="0; 0.2611; 0.2833; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="3200ms"
      values="-20; 130; 130; 760; 760"
      keyTimes="0; 0.0833; 0.25; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="3200ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.2278; 0.25; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="3200ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="3200ms"
      values="-20; 130; 130; 760; 760"
      keyTimes="0; 0.0833; 0.25; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="3200ms"
      values="40; 40; -20; -20"
      keyTimes="0; 0.2278; 0.25; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="4000ms"
      values="-20; 70; 70; 760; 760"
      keyTimes="0; 0.05; 0.2167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="4000ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.1944; 0.2167; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="4000ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="4000ms"
      values="-20; 70; 70; 760; 760"
      keyTimes="0; 0.05; 0.2167; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="4000ms"
      values="40; 40; -20; -20"
      keyTimes="0; 0.1944; 0.2167; 1"></animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="4800ms"
      values="-20; 10; 10; 760; 760"
      keyTimes="0; 0.0167; 0.1833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="4800ms"
      values="120; 120; 80; 80"
      keyTimes="0; 0.1611; 0.1833; 1"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="4800ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="40" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="4800ms"
      values="-20; 10; 10; 760; 760"
      keyTimes="0; 0.0167; 0.1833; 0.6; 1">
    </animate>
    <animate attributeName="cy" repeatCount="indefinite" dur="24s" begin="4800ms"
      values="40; 40; -20; -20"
      keyTimes="0; 0.1611; 0.1833; 1"></animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="5600ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="5600ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="6400ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="6400ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <circle cx="-20" cy="80" r="18" stroke-width="1.5" stroke="var(--illus-label)" fill="var(--illus)">
    <animate attributeName="cx" repeatCount="indefinite" dur="24s" begin="7200ms"
      values="-20; -20; 760; 760"
      keyTimes="0; 0.1667; 0.6; 1">
    </animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="24s" begin="7200ms"
      values="
        var(--illus);
        var(--illus);
        color-mix(in lab, var(--illus) 83%, var(--illus-label));
        color-mix(in lab, var(--illus) 67%, var(--illus-label));
        color-mix(in lab, var(--illus) 50%, var(--illus-label));
        color-mix(in lab, var(--illus) 33%, var(--illus-label));
        color-mix(in lab, var(--illus) 17%, var(--illus-label));
        var(--illus-label);
        var(--illus-label);"
      keyTimes="0; 0.3833; 0.4111; 0.4389; 0.4667; 0.4944; 0.5222; 0.55; 1">
    </animate>
  </circle>
  <text x="520" y="35" fill="var(--text)" text-anchor="middle" font-size="large" font-weight="bold">CPU</text>
  <rect x="370" y="5" width="300" height="140" stroke="var(--muted)" stroke-width="5" fill="none"/>
</svg>

If we suppose a processor that would have had 5 instructions simultaneously in
its pipeline, the conditional would then cost about 5 times more than other
instructions, since 0 other instructions are processed while it traverses the
pipeline, instead of 4.

Nowadays, this has changed. Modern processors have something called "branch
prediction". There are different quality of branch prediction, but the general
principle is as follows: instead of stalling, emptying the pipeling while the
condition goes through, and restarting, it takes one branch (trying to predict
the right one), and continues to cram it in the processor's pipeline along the
condition evaluation.
- If it guessed right, that's perfect: no time has been wasted, the execution
  simply continues.
- If it was wrong, these processors have a specific mechanism that allows to
  "roll back" these instructions from the wrong branch that had their execution
  started. It's super-fast, and yields an empty pipeline as if nothing had
  happened. Then we start refilling that pipeline with the correct instructions
  from the selected branch.

This is much faster than the previous method, especially as processors are
really good at predicting correctly. Many conditions are skewed one way or
another. Consider the question of whether you are using the dark or the light
theme to watch this page. It is highly unlikely that the distribution would be
perfectly 50/50, if only because dark is the default. If we iterate the pixels
of an image, we will have to be careful around the boundaries, but most pixels
are not on a boundary.

Everytime we guess correctly, the cost of branching is 0.

Of course, when we guess wrong, the cost is more, instead. The roll-back is very
fast, but nowadays processing pipelines are several times longer than they used
to be, and once all instructions of the wrong branch have been rolled back the
pipeline needs refilling as before.

So the situation with these more modern architectures is very different from
before: branching on conditions that are almost always `true` and only
occasionally `false`, or on conditions that are almost always `false` and only
occasionally `true` cost much less than before. On the other hand, conditions
that are equally distributed (equiprobability), are even more expensive than
before (relative to other instructions).

We mentioned earlier that not all branch-predictors are equal. Low-end
processors can have branch predictors that are not as performant as high-end
processors, leading to sometimes significant differences in performance.

It will be helpful to have that in mind because it will help understanding why
the language and a lot of code gets to great length to avoid branching, but also
to understand that this landscape has changed not so long ago, in a way that
does **not** make the problem vanish, but changes its dynamic.

````aside> [[likely]]/[[unlikely]]
C++20 gives us a tool to nudge the branch prediction one way or the other: the
attributes `[[likely]]` and `[[unlikely]]`.

This is an advanced tool for very specific cases, not something to use
everywhere. The compiler is free to ignore it: it's only a hint. But also, by
getting it wrong, we can really damage the performances. Code evolves, and it is
not so unlikely that the attribute could remain when the probabilities change.

In a `if` statement, the attribute comes after the condition, before the body.
In an `else` clause, it comes right after the `else`. Confusingly, in a
`switch` statement (next section), it comes before the `case` keyword.

I would recommend only using these based on (profile-guided) profiling
measurement suggesting that the compiler gets the prediction wrong.
````
 
### switch statements

The `switch` statement can be a good alternative to `if` / `else if` chains. It
selects and execute one statement out of several options. Unfortunately it is
also a specific tool for a specific usage with a number of sharp edges.

Like the `if` it has a condition expression (which can also be a simple
declaration), but instead of converting it to a boolean value, it compares the
value of the expression agains several options provided as "labels". But here is
our first sharp edge: the value of that expression must be an integral type.
`int`, `char`, `bool`, or an `enum` value that we will see later, but no
character string, no floating-point, no custom types.

There are two types of labels:
- `case`, followed by a constant expression. If the condition expression
  evaluates to the value of that constant expression, the execution resumes from
  that label.
- `default`. This label is the catch-all for values that don't match other
  labels. In this sense, it is similar to the `else` clause of an `if`
  statement.

````pitfall
But there is a severe trap: instead of jumping over the rejected alternative
statements, like the `if` jumping over an `else` clause, the `switch` executes
all the statements after the label it jumps to unless we tell it to skip, with
the keyword `break`.

It is easy to forget and can lead to puzzling errors.
````

```cpp
int result = 0;

switch(a)
{
  case 20:
    result = 1;
  case 40:
    result = 2;
    break;
  case 80:
    result = 4;
    [[fallthrough]]
  case 100:
    result += 8;
    break;
  default:
    result = 16;
    break;
}
```

In this example, note that the first `case`, `20`, has no `break`. This means
that when `a` is `20`, `result = 1` will be executed, and then it will continue
executing, going to `result = 2`, and then `break`. This is the confusing case
we mentioned before: because `break` was forgotten, execution continues, and
overwrites `result`. Observing this program, it will look as if `case 20` is
inexplicably ignored, yielding instead the result expected for `case 40`.

Most compiler will issue a "warning" in such case. Although warning are usually
non-blocking (unless explicitely configured to be treated as errors), it can
save a lot of time to pay attention to them.

`case 40` has a break, and will thus safely jump outside of the `switch` after
setting `result` to `2`.

`case 80` and `case 100` illustrate a case where we might want to use this
fallthrough behaviour: because `case 100` modifies `result` instead of setting
its value, by omitting deliberately the `break` for `case 80`, this case sets
`result` to `12`: `4 + 8`. Now this will most likely issue the warning we
mentioned before. To remove this warning, you can tell the compiler you know
what you are doing by adding `[[fallthrough]]` at the end of the `case`.

Any other value will go to the `default` case, setting `result` to `16`.

````aside> Why is it so finicky?
As often, there is a good reason for these constraints. The reason is that the
very point of a `switch` statement is to be more efficient than an `if`/`else
if`/`else` sequence, most of the time, ideally by minimising the amount of
[branching](#branching).

One technique to make the `switch` more efficient than a series of `if`/`else
if`/`if` uses `jump tables`. A jump table is an array containing the different
destinations to jump to (the case label location in the code).

Instead of testing each value one by one, the compiler uses the value tested
(the value of the condition expression) as an index into the jump table.

If the values are small and contiguous they are used directly, but even when
they aren't the compiler can use simple linear arithmetic to (offsetting,
scaling) to transform the tested value into a convenient index.

For the example above, it could for instance subtract 20 and divide by 20. `case
20` becomes index `0`, `case 40` index `1`, `case 80` index `3`, and `case 100`
index `4`. Instead of comparing `a` with many different values, we can compute
that index (`(a - 20) / 20`), and make only one comparison:
- index 0: is `a` exactly `20`? If yes, then jump to `case 20`, otherwise, jump
  to `default`.
- index 1: is `a` exactly `40`? If yes, then jump to `case 40`, otherwise, jump
  to `default`.
- index 2: jump to `default`.
- index 3: is `a` exactly `80`? If yes, then jump to `case 80`, otherwise, jump
  to `default`.
- index 4: is `a` exactly `100`? If yes, then jump to `case 100`, otherwise,
  jump to `default`.
- any other index: jump to default.

There are other tricks for different cases, such as using dichotomy to converge
quickly towards the right test for cases where the `case` values are sparse.

Floating points are [too treacherous](./01-data.html#bytes-as-floating-point-)
to survive reliably such clever manipulations. Consider for instance that `0.1f
+ 0.2f` is **not** equal to `0.3f`. It would be very error-prone.

Strings have their own challenge. They are inhernetly arrays (many characters),
making value comparison more involved than for single values.

````

