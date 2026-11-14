import { Directory, File, Paths } from 'expo-file-system';

const directory = new Directory(Paths.document, 'journal-images');

export function savePickedPhoto(uri: string): string {
  directory.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const suffix = uri.split('.').pop()?.toLowerCase();
  const extension = suffix === 'png' ? 'png' : 'jpg';
  const filename = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const destination = new File(directory, filename);
  source.copy(destination);
  return destination.uri;
}

export function deleteLocalPhoto(uri: string | null): void {
  if (!uri || !uri.startsWith(directory.uri + '/')) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Retain the journal record even if filesystem cleanup fails.
  }
}
