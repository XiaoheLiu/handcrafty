# Basic Unit Testing with Jest

General format:

```javascript
describe('Test Suite Name', () => {
  it('works for case 1', () => {
    expect(1).toEqual(1);
    const age = 100;
    expect(age).toEqual(100);
  });

  it('works for case 2', () => {
    expect(someList).toContain('some string');
  });
});
```

You can skip some test by:

```javascript
it.skip();
xit(); // [Same as it.skip]
```

You can focus on certain test by:

```javascript
it.only();
fit(); //   [Stands for focus it]
```
