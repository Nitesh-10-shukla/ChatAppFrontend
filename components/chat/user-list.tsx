import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/lib/api/users";
import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Settings, Search, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useLogout } from "@/hooks/useLogout";
import { UserProfileModal } from "./user-profile-modal";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserList() {
  const {
    users,
    activeUserId,
    setActiveUser,
    currentUser,
    typingUsers,
    setUsers,
  } = useChatStore();

  const { setParam, getParam } = useQueryParam();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOwnProfile, setShowOwnProfile] = useState(false);

  const usersApi = new UsersApi();

  const router = useRouter();
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      const mergedUsers = [...users];

      data.forEach((apiUser) => {
        if (!mergedUsers.find((u) => u.id === apiUser.id)) {
          mergedUsers.push({ ...apiUser, isOnline: false });
        }
      });

      setUsers(mergedUsers);
    }
  }, [data, setUsers]);

  const otherUsers = users
    .filter((user) => user.id !== currentUser?.id)
    .filter((user) => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const logoutMutation = useLogout();

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleUserClick = (userId: string, username: string) => {
    setActiveUser(userId);
    setParam("user", username); // store username in query param
  };

  const handleUserProfileClick = (user: User) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleStartChat = () => {
    if (selectedUser) {
      handleUserClick(selectedUser.id, selectedUser.username);
      setShowProfileModal(false);
    }
  };
  useEffect(() => {
    const usernameInQuery = getParam("user");
    if (usernameInQuery) {
      const foundUser = users.find((u) => u.username === usernameInQuery);
      if (foundUser) {
        setActiveUser(foundUser.id);
      }
    }
  }, [users, getParam, setActiveUser]);

  return (
    <>
      <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
        <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => setShowOwnProfile(true)}
            >
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser?.avatar || ""} />
              <AvatarFallback>
                {currentUser?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-foreground">{currentUser?.username}</p>
                <p className="text-sm text-green-500 dark:text-green-400">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowOwnProfile(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
      </div>

      {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
              Contacts ({otherUsers.length})
          </h3>
            <div className="space-y-1">
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
            ) : (
              otherUsers.map((user) => {
                const isTyping = user.id && typingUsers.includes(user.id); // Add this line

                return (
                    <div key={user.id} className="relative group">
                      <Button
                        variant={activeUserId === user.id ? "secondary" : "ghost"}
                        className={`w-full justify-start h-auto p-3 transition-all hover:bg-gray-50 ${
                          activeUserId === user.id ? "bg-primary/10 border-r-2 border-primary" : ""
                        }`}
                        onClick={() => handleUserClick(user.id, user.username)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                      <div className="relative">
                            <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.avatar || ""} />
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
                                user.isOnline ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                            <p className="font-semibold text-sm text-foreground">{user.username}</p>
                            <p className="text-xs text-muted-foreground">
                          {isTyping ? (
                                <span className="animate-pulse text-primary font-medium">
                              typing...
                            </span>
                          ) : user.isOnline ? (
                            "Online"
                          ) : (
                            "Offline"
                          )}
                        </p>
                      </div>
                    </div>
                      </Button>
                      
                      {/* Profile button on hover */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserProfileClick(user);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                );
              })
            )}
          </div>
        </div>
        </ScrollArea>
      </div>

      {/* Profile Modals */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isOwnProfile={false}
        onStartChat={handleStartChat}
      />

      <UserProfileModal
        user={currentUser}
        isOpen={showOwnProfile}
        onClose={() => setShowOwnProfile(false)}
        isOwnProfile={true}
        onUpdateProfile={(data) => {
          console.log("Update profile:", data);
          // Handle profile update
        }}
      />
    </>
  );
}
