"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function SearchForm({ className, ...props }: SearchFormProps) {
  const [value, setValue] = React.useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Handle search
    console.log("Search for:", value)
  }

  return (
    <form
      className={className}
      onSubmit={onSubmit}
      {...props}
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </form>
  )
}
