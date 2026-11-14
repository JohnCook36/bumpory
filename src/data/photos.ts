import { Directory, File, Paths } from 'expo-file-system';

const directory = new Directory(Paths.document, 'journal-images');

export async function savePickedPhoto(uri: string): Promise<string> {
  directory.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const suffix = uri.split('?')[0].split('.').pop()?.toLowerCase();
  const extension = ['png', 'jpeg', 'jpg', 'heic', 'webp'].includes(suffix || '') ? suffix : 'jpg';
  const filename = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const destination = new File(directory, filename);
  // Await the copy: the journal must never reference a temporary picker URI
  // before its original photo has reached persistent application storage.
  await source.copy(destination);
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
