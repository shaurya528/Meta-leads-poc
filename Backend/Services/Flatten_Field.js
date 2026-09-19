export function flatten_Field_Data(fieldData = []) {
    return fieldData.reduce((acc, field) => {
      acc[field.name] = field.values?.[0] ?? '';
      return acc;
    }, {});
  }