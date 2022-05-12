describe('Default cases', () => {
  test('Have returns', () => {
    const drink = jest.fn(() => 12);
    drink();
    expect(drink).toHaveReturned();
  });
});

export {}
