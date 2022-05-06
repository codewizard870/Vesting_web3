import React, { useEffect, useState } from 'react'
import { Signup } from './Signup'
import { Signin } from './Signin'
import { Logo } from 'components/Logo'
import { PrimaryButton } from 'components/PrimaryButton'
import { useSession } from 'contexts'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(true)
    const [isRegistered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [isUnderProcess, setUnderProcess] = useState(false)
    const [isLogined, setLogined] = useState(false)
    const [isNotVerifiedEmail, setNotVerifiedEmail] = useState(false)
    const { requestResendVerification } = useSession()

    const handleResend = async (e: any) => {
        e.preventDefault()
        try {
            const res = await requestResendVerification(registeredEmail)
            if (res.errors) {
                console.log(res.errors)
            } else {
                if (res.action === 'success') {
                    toast.success("New verification sent!")
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handleSendSignUp = (email: string) => {
        setRegisteredEmail(email)
        setRegistered(true)
    }
    return (
        <div className="w-full bg-no-repeat bg-center bg-white md:bg-[url('./assets/images/signup/hero.png')]" style={{ minHeight: '100vh' }}>
            <div className="h-full w-full md:w-[720px] md:bg-[#FFFFFF]/70" style={{ minHeight: '100vh' }}>
                <div className="w-full bg-top bg-[url('./assets/images/signup/hero_mobile.png')] md:bg-none">
                    <div className='w-full flex flex-col justify-center items-center md:items-start gap-5 bg-[#FFFFFF]/70 md:bg-transparent pt-[70px] md:pt-[40px] pb-[90px] md:pb-[110px] px-8 md:px-20'>
                        <Logo />
                        <div className='text-[#36BBEB] text-[18px] font-semibold uppercase'>
                            LIQUIDITY AGGREGATION, TRANSFORMED
                        </div>
                    </div>
                </div>
                <div className="px-10 md:px-20 py-6 md:py-10">
                    {!isRegistered && !isLogined ? <div className='w-full h-full flex flex-col items-center'>
                        <div className='w-full md:w-[440px]'>
                            <div className='w-full flex justify-center'>
                                <div className='flex w-[310px] md:w-[392px] border rounded-[5px] border-[#050025]'>
                                    {isSignUp ? <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 rounded-[4px] bg-[#050025] text-white text-[18px] font-semibold uppercase'>Sign Up</div> :
                                        <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 text-[18px] font-regular text-[#051C42] cursor-pointer uppercase' onClick={() => setIsSignUp(true)}>Sign Up</div>}
                                    {!isSignUp ? <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 rounded-[4px] bg-[#050025] text-white text-[18px] font-semibold uppercase'>Login</div> :
                                        <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 text-[18px] font-regular text-[#051C42] cursor-pointer uppercase' onClick={() => setIsSignUp(false)}>Login</div>}
                                </div>
                            </div>
                            {isSignUp && <Signup setIsSignUp={setIsSignUp} handleSendSignUp={handleSendSignUp} />}
                            {!isSignUp && <Signin setIsSignUp={setIsSignUp} setLogined={setLogined} setNotVerifiedEmail={setNotVerifiedEmail} setUnderProcess={setUnderProcess} />}
                        </div>
                    </div> : <>
                        {(isNotVerifiedEmail || isRegistered) && <div className='w-full flex flex-col mt-24 md:mt-0 gap-8 justify-center items-center'>
                            <div className='text-[28px] font-500 text-[#474747] text-center'>{isRegistered ? 'Thank you for registering.' : 'Your email is yet to be verified.'}</div>
                            <div className='text-[18px] text-[#474747] text-center'>
                                An email has been sent to activate your account.<br />
                                Please click the link to activate your account.
                            </div>
                            <div className='mt-4'>
                                <PrimaryButton onClick={handleResend} width='275px'>
                                    Resend Verification
                                </PrimaryButton>
                            </div>
                            <Link to="/">
                                <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
                            </Link>
                        </div>}
                        {isUnderProcess && <div className='w-full flex flex-col mt-24 md:mt-0 gap-8 justify-center items-center'>
                            <div className='text-[28px] font-500 text-[#474747] text-center'>Your verification is under process.</div>
                            <div className='text-[18px] text-[#474747] text-center'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br />
                                sed do eiusmod tempor incididunt ut labore<br />
                                et dolore magna aliqua.
                            </div>
                            <Link to="/">
                                <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
                            </Link>
                        </div>}
                    </>}
                </div>
            </div>
        </div>
    )
}
