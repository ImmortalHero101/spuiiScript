# spuiiScript for Echo
A JavaScript library for the Echo bot on Discord that allows you to create and play with custom variables that are automatically saved to the server's database.

## Description

spuiiScript allows you to create and manage custom variables that are encapsulated in an object, allowing the user to manage them easily and apply various commands to it.

This can be useful if you want to save the user's data in a specific format for each case, like data for a game.

The custom variables can be stored at different scopes, `local` which is only accessible by the user, and `global` which is accessible by anyone. Accessing these scoped variables will be discussed in the documentation.

## Access
Access `spuiiScript` by including `import "https://raw.githubusercontent.com/ImmortalHero101/spuiiScript/master/spuiiScript.js";` in the beginning of your JavaScript section after creating a database called `spuiiDat`.

## Documentation

**Note:** I'll be using the console format in examples to give an idea how the code would work and which values will be returned by it, and a question mark "`?`" before an argument name determines that it is optional to include that argument.

### Scope (Function argument)
nth argument (scope \[string] (Case insensitive)) by using the predefined variables `l` (local) or `g` (global) or use string value of `"local"` or `"global"`. Any invalid value will be ignored and local scope will be used.
##### Example
```js
// Syntax: definedFunction(..., scope [string])
> $('variable', 'value', l); // Defining the local scope using the predefined 'l' varaible
```
### Creating a variable
#### Single variable
Using the `$` function, provide with two arguments (name \[string] and value \[any]) for creating local access variables and provide a third argument as [scope](#scope-function-argument).

**Alternative:** `$.set(name [string], value [any], scope [string] (optional))`
##### Example:
```js
// Syntax: $(name, value, scope [string] (optional))
> $('a', 1); // Creating variable 'a' with value '1' at local access, same as "$('a', 1, l);" or "$.set('a', 1, l);"
< undefined
> $('b', 2, g); // Creating variable 'b' with value '2' at global access, same as "$('b', 2, 'global');" or "$.set('b', 2, g);"
< undefined
```
#### Bulk creation
Using the `$` function, provide with with one argument (object) for creating all the object's defined properties as local access variables and provide a second argument as the [scope](#scope-function-argument).
##### Example:
```js
// Syntax: $(object, ?scope [string])
> $({d:3,e:4,f:5}); // Creating bulk variables 'd', 'e' and 'f' at local level
< undefined
> $({g:6,h:7,i:8}, g); // Creating bulk variables 'g', 'h' and 'i' at local level
< undefined
```

### Accessing a variable
Using the `$` function, provide with one argument (name \[string]) to get a local access variable. [Scope](#scope-function-argument) argument not supported in this syntax to prevent any errors. Throws an error if variable does not exist. The **alternative** `$.get(name, scope)` can be used to access variables at respective [scopes](#scope-function-argument).
##### Example
```js
// Syntax: $(name [string])
> $('a'); // Accessing variable 'a' at local scope, same as "$.get('a', l)"
< 1
> $.get('h', g); // Accessing variable 'h' at global scope, same as "$.get('h', g)"
< 7
> $('h') // Trying to access variable 'h' at local scope
< Error: Variable 'h' does not exist in local scope!
```

### Checking variable existence
Using the `$.exists` function, provide with two arguments (name \[string], ?scope \[string]) to get a Boolean value determining the existence of the variable in a scope. Do not try to take advantage of JavaScript's automatic value conversion to see if a variable exists or not because if a variable does not exist, an exception is thrown.
##### Example
```js
// Syntax: $.get(name [string], ?scope [string])
> $.exists('d'); // Checking if variable 'd' exists at local scope
< true // Indicates that it exists
> $.exists('h', g); // Checking if variable 'h' exists at global scope
< true
> $.exists('b'); // Checking if variable 'b' exists at local scope
< false
```

### Changing a variable's scope (Might get removed)
Using the `$.changeScope` function, provide with three arguments (name \[string], fromScope \[string], toScope \[string]) to move a variable from one scope to another.
##### Example
```js
// Syntax: $.changeScope(name [string], fromScope [string], toScope [string])
> $.changeScope('d', l, g); // Moving variable 'd' from local scope to global scope
< undefined
> $.exists('d');
< false
> $.changeScope('a', g, l); // Trying to move an undefined variable will throw an error
< Error: Variable 'a' does not exist in global scope!
```

### Mapping every variable
Using the `$.map` function, provide with two arguments (func \[function], ?scope \[string]) to apply the provided function to every variable on a scope. The first parameter of the function argument will be the value being passed and the second parameter will be the index.
##### Example
```js
// Syntax: $.map(func [function], ?scope [string])
> $.map(function(valueArg, indexArg) {       // Calling the map function with two named parameters, each defining the value they contain
    console.log(indexArg + ": " + valueArg); // Logging the values along with their index numbers in the console
  });
< "0: 1"
< "1: 4"
< "2: 5"
< undefined
```

### Finding all variables with a value
Usiing the `$.find` function, provide with two arguments (value \[any], ?scope \[string]) to search every variable for the value. The function returns an object containing four properties (values, keys, indexes, and scope) named "value" (returns a single value), "indArr" (returns an array of indexes), "keyArr" (returns an array of keys) and "scope" (returns the scope).
##### Example
```js
// Syntax $.find(value [any], ?scope [string])
> $('b', 1); // Creating a variable as a demonstration
< undefined
> $.find(1); // Finding integer "1" in local scope
< {value: 1, indArr: [0, 1], keyArr: ["a", "b"], scope: "local"} // An object with defined properties
```

### Embeds
spuiiScript allows you to create and customize embeds easily with it's extensive predefined methods. These methods can be used once the embed object has been constructed using the `$embed` function. The function accepts only one argument (embed properties \[object]), an object that defines the structure of the embed. An ordinary embed can be divided into author, a header, a body, and a footer, and using the initials of the components as the object's property names allow you to define the structure of the embed at ease, and each property accepts an array of fixed number of values. However, the color component (property starting with it's initial) will only accept a string. Each property with it's proper description is displayed below:

**Property:**
 - "a": (Author component) First array value is the "Author name" as string, and second array value is "Author Icon URL" as string.
   - The function will not construct the author component if the "Author name" is empty or has a non-string value.
   - An invalid image URL (URL's not ending with an image file extension) for the "Author Icon URL" will not be be used and no icon will appear.
 - "h": (Header component, optional) First array value is the "Embed title" as string, the second array value is "Embed description" as string, and the third array value is the "Embed Title URL" as string.
   - The function will not construct the header component if the "Embed title" and "Embed description" are empty or have a non-string value.
   - An invalid URL for the "Embed Title URL" will not be used.
 - "b": (Body component, mandatory) Accepts an even number of array values, every odd array index (counting from 1) is the "Field name" as string, and every even array index is "Field value" as string.
   - The function will throw an exception if the body's components "Field name" and "Field value" are empty, have an odd number of array entries, or have a non-string value.
 - "f": (Footer component, optional) First array value is the "Footer text" as string, and the second array value is "Footer Icon URL" as string.
   - The function will not construct the footer component if the "Footer text" is empty or has a non-string value.
   - An invalid image URL (URL's not ending with an image file extension) for the "Footer Icon URL" will not be be used and no icon will appear.
 - "c": (Color component, optional) A string containing either a 3-digit HEX code in the format "#RGB" or 6-digit hex code in the format "#RRGGBB", or a decimal value in the RGB format "RRR,GGG,BBB".
   - A wrong color code format, non-string value, or out-of-range values will throw an exception.
   - The ordinary decimal value as color code is not accepted at the moment.
