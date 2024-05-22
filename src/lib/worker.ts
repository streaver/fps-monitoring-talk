self.onmessage = (e: MessageEvent) => {
  const n: number = e.data;
  postMessage(fibonacci(n));
};

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export default null as any;
