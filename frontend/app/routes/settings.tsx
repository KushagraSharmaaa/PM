import { useAuth } from "@/provider/auth-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [profilePic, setProfilePic] = useState(user?.profilePicture || "");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );
  const [isSaving, setIsSaving] = useState(false);

  // Placeholder for save profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile updated (demo only)");
      setIsSaving(false);
    }, 800);
  };

  // Placeholder for change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Password changed (demo only)");
      setPassword("");
      setIsSaving(false);
    }, 800);
  };

  // Theme switcher
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 transition-colors duration-300">Settings</h1>
      <div className="bg-card rounded-xl shadow-lg p-8 max-w-lg mx-auto border border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-md animate-fade-in space-y-8">
        {/* Edit Profile */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>
          <div>
            <label className="block font-medium mb-1">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium mb-1">Profile Picture URL</label>
            <Input value={profilePic} onChange={e => setProfilePic(e.target.value)} />
          </div>
          <Button type="submit" disabled={isSaving} className="transition-all duration-200">
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isSaving} className="transition-all duration-200">
            {isSaving ? "Changing..." : "Change Password"}
          </Button>
        </form>

        {/* Theme Switcher */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Theme</h2>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="transition-all duration-200"
            >
              Light
            </Button>
            <Button
              type="button"
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="transition-all duration-200"
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

// Add fade-in animation to global CSS if not present:
// .animate-fade-in { @apply opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]; }
// @keyframes fadeIn { to { opacity: 1; } } 