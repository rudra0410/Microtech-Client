/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbItem {
  title: string;
  path: string;
  isLast: boolean;
}

interface BreadcrumbContextType {
  customBreadcrumbs: BreadcrumbItem[] | null;
  setCustomBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | null) => void;
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<
    BreadcrumbItem[] | null
  >(null);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BreadcrumbContext.Provider
      value={{
        customBreadcrumbs,
        setCustomBreadcrumbs,
        pageTitle,
        setPageTitle,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
