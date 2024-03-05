export class ValidateFields {
  convertBrazilianDateToJSDate(dateString: string) {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
}
