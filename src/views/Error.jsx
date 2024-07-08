import React from 'react'
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

function Error() {
    return (
        <div className='flex items-center justify-center h-full min-h-screen w-full'>

            <Card className="py-4 ">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">Ooops..!</p>
                    <small className="text-default-500">404 Error</small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src="https://i.pinimg.com/564x/49/e4/5f/49e45fa4fed20eb38f8f2c06c263e793.jpg"
                        width={270}
                        height={270}
                    />
                </CardBody>
            </Card>
        </div>
    )
}

export default Error