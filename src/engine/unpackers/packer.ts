export const PackerUnpacker = {
  detect(str: string): boolean {
    return PackerUnpacker.get_chunks(str).length > 0;
  },

  get_chunks(str: string): string[] {
    const chunks = str.match(/eval\(\(?function\(.*?(,0,\{\}\)\)|split\('\|'\)\)\))($|\n)/g);
    return chunks ? chunks : [];
  },

  unpack(str: string): string {
    const chunks = PackerUnpacker.get_chunks(str);
    let result = str;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].replace(/\n$/, '');
      const unpacked = PackerUnpacker.unpack_chunk(chunk);
      result = result.split(chunk).join(unpacked);
    }
    return result;
  },

  unpack_chunk(str: string): string {
    let unpackedSource = '';
    try {
      // Safely trap eval call without executing arbitrary hostile payloads in global window
      const sandbox = new Function('eval', str);
      sandbox((codePayload: string) => {
        unpackedSource += codePayload;
        return codePayload;
      });
      if (typeof unpackedSource === 'string' && unpackedSource) {
        return unpackedSource;
      }
    } catch {
      // Return original if unpack evaluation fails
    }
    return str;
  },
};
