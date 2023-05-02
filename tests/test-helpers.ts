export const someValues: Array<any> = [3, 15, 2, 300, 16, 4, 1, 8, 50, 21, 58, 7, 4, 9, 78, 88, 100];
export const customValues: Array<any> = someValues.map((n) => [n % 10, n]);

export const customTop = (...values: any[]) => {
  let min = values[0];
  for (const value of values) {
    if (min[1] > value[1]) {
      min = value;
    }
  }
  return min;
};

export const customBottom = (...values: any[]) => {
  let max = values[0];
  for (const value of values) {
    if (max[1] < value[1]) {
      max = value;
    }
  }
  return max;
};

export const equalUnsortedArrays = (array: any[], values: any[]) => {
  expect(array.length).toBe(values.length);
  for (const value of values) {
    expect(array).toContainEqual(value);
  }
};
