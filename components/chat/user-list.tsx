import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/lib/api/users";
import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useLogout } from "@/hooks/useLogout";

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

  const otherUsers = users.filter((user) => user.id !== currentUser?.id);

  const logoutMutation = useLogout();

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleUserClick = (userId: string, username: string) => {
    setActiveUser(userId);
    setParam("user", username); // store username in query param
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatar || ""} />
              <AvatarFallback>
                {currentUser?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser?.username}</p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
            Users ({otherUsers.length})
          </h3>
          <div className="space-y-1">
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              otherUsers.map((user) => {
                const isTyping = user.id && typingUsers.includes(user.id); // Add this line

                return (
                  <Button
                    key={user.id}
                    variant={activeUserId === user.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleUserClick(user.id, user.username)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar || ""} />
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            user.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {isTyping ? (
                            <span className="animate-pulse text-blue-500">
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
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
