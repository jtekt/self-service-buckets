export default function Page() {
  return (
    <>
      <h2 className="text-2xl my-2">Home</h2>
      <div className="flex flex-col gap-2">
        <a href="/accounts/new">Create account</a>
        <a href="/buckets">Buckets</a>
        <a href="/keys/new">Create key</a>
      </div>
    </>
  );
}
