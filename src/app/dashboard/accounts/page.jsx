import Link from "next/link";

const accountsPage = () => {
  return (
    <div>
      <h1>Accounts Page</h1>
      <p>This is the accounts page.</p>
      <p>Manage your accounts here.</p>
      {/* Add more content or components as needed */}
      <Link href="/accounts/add" className="btn btn-primary mb-4">
        Add Account
      </Link>
      <Link href="/accounts/list" className="btn btn-secondary mb-4">
        View Accounts
      </Link>
      <Link href="/accounts/settings" className="btn btn-tertiary mb-4">
        Account Settings
      </Link>
      <Link href="/accounts/help" className="btn btn-quaternary mb-4">
        Help & Support
      </Link>
      <Link href="/accounts/logout" className="btn btn-danger mb-4">
        Logout
      </Link>
      <p>Use the links above to navigate through the accounts section.</p>
    </div>
  );
};
export default accountsPage;
export const metadata = {
  title: "Accounts",
  description: "Manage your accounts here",
};
