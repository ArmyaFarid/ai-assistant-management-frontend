import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDateToLocal = (
    dateStr: string,
    locale: string = 'en-US',
    showTime: boolean = false // Default is false
) => {
  const date = new Date(dateStr);

  // Ensure the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateStr);
    return 'Invalid date';
  }

  // Basic date options
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  // Add time options if showTime is true
  if (showTime) {
    Object.assign(options, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 12-hour format (change to false for 24-hour)
    });
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};


export function exportToExcel  (data : any , fileName : string){
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
  saveAs(blob, `${fileName}.xlsx`);
}
