export default function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-base-300 text-base-content">
      <aside>
        <p className="font-semibold">
          © {new Date().getFullYear()} CodeGenie-AI. All rights reserved.
        </p>
        <p>Built with ❤️ using Electron, Next.js & DaisyUI.</p>
      </aside>
    </footer>
  );
}
