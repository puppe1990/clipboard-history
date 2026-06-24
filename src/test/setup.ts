class MockDataTransferItem {
  readonly kind = 'file' as const;

  constructor(
    readonly type: string,
    private readonly blob: Blob | null
  ) {}

  getAsFile(): File | null {
    return this.blob as File | null;
  }
}

class MockDataTransferItemList {
  private readonly items: MockDataTransferItem[] = [];

  add(data: Blob): void {
    this.items.push(new MockDataTransferItem(data.type, data));
  }

  [Symbol.iterator](): Iterator<MockDataTransferItem> {
    return this.items[Symbol.iterator]();
  }
}

class MockDataTransfer implements DataTransfer {
  dropEffect = 'none' as DataTransfer['dropEffect'];
  effectAllowed = 'uninitialized' as DataTransfer['effectAllowed'];
  readonly files = [] as unknown as FileList;
  readonly items =
    new MockDataTransferItemList() as unknown as DataTransferItemList;
  readonly types: readonly string[] = [];
  private readonly data = new Map<string, string>();

  clearData(): void {
    this.data.clear();
  }

  getData(format: string): string {
    return this.data.get(format) ?? '';
  }

  setData(format: string, data: string): void {
    this.data.set(format, data);
  }

  setDragImage(): void {
    // no-op for tests
  }
}

if (typeof globalThis.DataTransfer === 'undefined') {
  globalThis.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer;
}
