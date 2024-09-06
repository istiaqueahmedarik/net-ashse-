'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Wifi, WifiOff, Cloud, CloudOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ConnectivityChecker() {

  const [isChecking, setIsChecking] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false)
  const audioContext = useRef<AudioContext | null>(null)

  const playConnectedSound = useCallback(() => {
    if (audioContext.current === null) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const oscillator = audioContext.current.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime) // A4 note

    const gainNode = audioContext.current.createGain()
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.current.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.5)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)

    oscillator.start()
    oscillator.stop(audioContext.current.currentTime + 0.5)
  }, [])

  const checkConnectivity = useCallback(async () => {
    const online = navigator.onLine
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' })
      if (!isOnline && !hasConnectedOnce) {
        playConnectedSound()
        setHasConnectedOnce(true)
      }
      setIsOnline(true)
    } catch (error) {
      setIsOnline(false)
    }
    setLastChecked(new Date())
  }, [isOnline, hasConnectedOnce, playConnectedSound])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isChecking) {
      checkConnectivity()
      interval = setInterval(checkConnectivity, 10000) // Check every 10 seconds
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isChecking, checkConnectivity])

  const handleToggleCheck = () => {
    setIsChecking(prev => !prev)
    if (!isChecking) {
      setHasConnectedOnce(false) // Reset the flag when starting a new check
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Internet Pulse
        </h1>

        <Button
          onClick={handleToggleCheck}
          className={`w-full text-lg py-6 transition-all duration-300 ease-in-out transform hover:scale-105 ${isChecking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {isChecking ? 'Stop Checking' : 'Start Checking'}
        </Button>

        <AnimatePresence>
          {isChecking && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className={`${isOnline ? "bg-green-400" : "bg-red-400"} text-white border-none`}>
                <motion.div
                  animate={{ rotate: isOnline ? 0 : 180 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-4 top-4"
                >
                  {isOnline ? (
                    <Cloud className="h-8 w-8 text-white" />
                  ) : (
                    <CloudOff className="h-8 w-8 text-white" />
                  )}
                </motion.div>
                <AlertTitle className="text-2xl font-semibold mb-2">
                  {isOnline ? 'Connected' : 'Disconnected'}
                </AlertTitle>
                <AlertDescription className="text-lg">
                  {isOnline ? 'Your internet is flowing smoothly!' : 'Oops! Your internet seems to be on a coffee break.'}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {isChecking && (
          <div className="flex items-center justify-center space-x-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking every 10 seconds...</span>
          </div>
        )}

        {lastChecked && (
          <motion.p
            className="text-sm text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Last checked: {lastChecked.toLocaleTimeString()}
          </motion.p>
        )}

        {/* <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isOnline ? (
            <Wifi className="h-8 w-8 text-white" />
          ) : (
            <WifiOff className="h-8 w-8 text-white" />
          )}
        </motion.div> */}
      </motion.div>
    </div>
  )
}