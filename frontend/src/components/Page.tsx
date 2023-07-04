import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { routes } from "../routes";
import { useUserContext } from "../contexts/UserContext";

interface IProps {
  isLoading?: boolean
}

const Page: FC<PropsWithChildren<IProps>> = ({ isLoading = false, children }) => {
  const { isInitialAuthorizationPending, isUserAuthorized } = useUserContext();

  return (
    <div className="h-full">
        <div className="text-white mb-6">
          <NavLink
            end
              className={({ isActive }) =>
                isActive ? "mr-4 text-accent" : "mr-4 hover:text-accent"
              }
              to={routes.home}
            > 
              Home
            </NavLink>

            <NavLink
              end
              className={({ isActive }) =>
                isActive ? "mr-4 text-accent" : "mr-4 hover:text-accent"
              }
              to={routes.goals}
            >
              Goals
            </NavLink>

            <NavLink
              end
              className={({ isActive }) =>
                isActive ? "mr-4 text-accent" : "mr-4 hover:text-accent"
              }
              to={routes.profile}
            >
              Profile
            </NavLink>

            {(!isInitialAuthorizationPending) && (
               <>
                {isUserAuthorized
                  ? (
                    <NavLink
                      end
                      className={({ isActive }) =>
                        isActive ? "mr-4 text-accent" : "mr-4 hover:text-accent"
                      }
                      to={routes.createGoal}
                    >
                      Create goal
                    </NavLink>

                    ) 
                  : (
                    <NavLink
                      end
                      className={({ isActive }) =>
                        isActive ? "mr-4 text-accent" : "mr-4 hover:text-accent"
                      }
                      to={routes.authLogin}
                    >
                      Login
                    </NavLink>
                  )
                }
              </>
            )}
        </div>

        <div className="h-full">
          {(isInitialAuthorizationPending || isLoading)
            ? (<div className="flex h-full items-center justify-center" ><CircularProgress/></div> )
            : (children)
          }
        </div>
    </div>
  );
};

export default Page;
