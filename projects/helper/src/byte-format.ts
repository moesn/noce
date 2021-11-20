export const byteFormat = function(byte: any): string {
  const k = 1024;
  const dm = 2;
  const bytes = parseInt(byte, 0);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return bytes ? parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] : '0 Bytes';
};
