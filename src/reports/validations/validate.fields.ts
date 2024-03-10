export class ValidateFields {
  convertBrazilianDateToJSDate(dateString: string) {
    const [day, month, year] = dateString.split('/');
    const date = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0),
    );
    date.setUTCDate(date.getUTCDate() + 1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  convertJSDateToBrazilianDate(dateString: string) {
    const [day, month, year] = dateString.split('-');
    return new Date(`${day}/${month}/${year}`);
  }
}
