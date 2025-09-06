// File: src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container mx-auto text-center">
        <p className="text-inherit">
          &copy; {new Date().getFullYear()} TEST Pet Grooming. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
