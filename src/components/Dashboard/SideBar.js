import Link from 'next/link';
import { useRouter } from 'next/router';
import sidebarMenu from '../../_data/sidebarMenu.json'; // Adjust the path as necessary

export default function Sidebar() {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-700 text-gray-100">
        <div className="px-3 py-4">
            <nav className="flex flex-col space-y-2">
            {sidebarMenu.map((item) => (
                <Link key={item.title} href={item.path} legacyBehavior>
                <a className={`flex items-center px-3 py-2 rounded ${isActive(item.path) ? 'bg-gray-600' : ''} hover:bg-gray-600 transition-colors duration-200 ease-in-out`}>
                    {/* Assume you have a way to render icons based on the icon name */}
                    <span className={`icon-${item.icon} mr-3`}></span>
                    {item.title}
                </a>
                </Link>
            ))}
            </nav>
        </div>
    </aside>
  );
}