# spuiiScript for Echo
A JavaScript library for the Echo bot on Discord that allows you to create and play with custom variables that are automatically saved to the server's database.

The custom variables are stored in a separate object that allows the user to access and execute cool commands to it without affecting any ordinary variables or predefined properties.

The custom variables can be stored at different scopes, `local` which only the creator can access and `global` which others can access. Accessing these scoped variables will be discussed in the documentation.

## Access
Access `spuiiScript` by including `import "https://raw.githubusercontent.com/ImmortalHero101/spuiiScript/master/spuiiScript.js";` in the beginning of your JavaScript section after creating a database called `spuiiDat`.

## Documentation
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
// Syntax: $(object, scope [string] (optional))
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
< Error: Variable 'h' does not exist at local scope!
```
