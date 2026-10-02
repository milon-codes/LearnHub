'use client'

import { useParams } from 'next/navigation'


const page = () => {

    const params = useParams();
console.log(params.categoryName, 'ccc');


  return (
    <div>
      Category : {params.categoryName}
    </div>
  )
}

export default page
