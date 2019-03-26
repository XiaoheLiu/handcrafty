import formatMoney from '../lib/formatMoney';

describe('formatMoney Function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(123)).toEqual('$1.23');
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(100012)).toEqual('$1,000.12');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(2500)).toEqual('$25');
    expect(formatMoney(2500000)).toEqual('$25,000');
    expect(formatMoney(2500000000)).toEqual('$25,000,000');
  });
});
