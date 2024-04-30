import MainNav from "@/components/main-nav"

const Navbar = () => {
  return (
    <div className="border-b">
        <div className="flex justify-between items-center h-12 p-4">
            <div className="mr-4">Logo</div>
            <MainNav />
            <div className="ml-auto">User</div>
        </div>
    </div>
  )
}

export default Navbar