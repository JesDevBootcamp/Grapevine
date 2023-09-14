// Home Page: Page for displaying and creating new server messages.

import { useState, useEffect } from 'react'
import axios from 'axios'
import InputArea from '../components/InputArea'
import Messages from '../components/Messages'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import CreateServerModal from '../components/CreateServerModal'
import CreateInvite from '../components/CreateInvite'
import PublicServers from '../components/PublicServers'
import ShowInvites from '../components/ShowInvites'
import JoinServer from '../components/JoinServer'
import SettingsPanel from '../components/SettingsPanel'

import { ToastContainer, toast } from 'react-toastify'
import lodash from 'lodash'

import '../styles/home-page.scss'
import Logout from '../components/Logout'
import Dock from '../components/Dock'

export default function HomePage({
    messages,
    setMessages,
    currentServer,
    setCurrentServer,
}) {
    const [username, setUsername] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showServerModal, setShowServerModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showInvitesModal, setShowInvitesModal] = useState(false)
    const [showJoinServerModal, setShowJoinServerModal] = useState(false)
    const [serverList, setServerList] = useState([])
    const [showAllServersModal, setShowAllServersModal] = useState(false)
    const [publicServers, setPublicServers] = useState([])
    const [invites, setInvites] = useState([])
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        axios.get('/api/username').then(({ data }) => {
            if (data.Success) {
                setUsername(data.Success.user)
                setProfileImage(data.Success.image)
                getAllServers()
                getPublicServers()
            } else if (data.Error) {
                setShowModal(true)
            }
        })
    }, [showModal, showServerModal])

    async function getAllServers() {
        await axios.get('/api/server/getall').then((res) => {
            if (res.data.Success[0]) {
                setServerList(res.data.Success)
            }
        })
    }

    async function getPublicServers() {
        await axios.get('/api/server/getpubservers').then(({ data }) => {
            const availableServers = []
            if (data.Success) {
                for (const obj1 of data.Success) {
                    if (!serverList.some((obj2) => obj2.id === obj1.id)) {
                        availableServers.push(obj1)
                    }
                }
            }
            setPublicServers(availableServers)
        })
    }

    async function handleSubmit(message) {
        const { data } = await axios.put('/api/message', {
            server: currentServer.name,
            message,
        })

        if (data.Success) {
            socket.emit('client message', {
                username,
                message,
                server: currentServer.id,
                userImage: profileImage,
            })
        } else {
            socket.emit('client message', {
                username,
                message: `I think I want a pet unicorn. I'll name him ${lodash.sample(
                    [
                        'Terry',
                        'Fred',
                        'Jeffrey',
                        'Franklin',
                        'Froggy Fresh',
                        'Samuel',
                        'Bart',
                        'Rocky',
                        'Apollo',
                        'Zelda',
                        'Mario',
                        'Kyle',
                        'Larry',
                    ]
                )}.`,
                server: currentServer.id,
            })
        }
    }

    return (
        <main className="home-page">
            <Dock
                anchors={serverList}
                setCurrentServer={setCurrentServer}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
            />
            <RegisterModal
                showRegisterModal={showRegisterModal}
                setShowRegisterModal={setShowRegisterModal}
                setUsername={setUsername}
                username={username}
            />
            {/* only display toastcontainer if no modals are blurring the background */}
            {!showModal &&
            !showServerModal &&
            !showInvitesModal &&
            !showJoinServerModal &&
            !showAllServersModal ? (
                <ToastContainer
                    position="top-center"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    theme="dark"
                />
            ) : (
                <></>
            )}
            <SettingsPanel
                showSettings={showSettings}
                setShowModal={setShowModal}
                setMessages={setMessages}
                setCurrentServer={setCurrentServer}
                setServerList={setServerList}
                currentServer={currentServer}
                showInvitesModal={showInvitesModal}
                setShowInvitesModal={setShowInvitesModal}
            />
            <LoginModal
                showModal={showModal}
                setShowModal={setShowModal}
                setUsername={setUsername}
                username={username}
                showRegisterModal={showRegisterModal}
                setShowRegisterModal={setShowRegisterModal}
            />
            <button
                onClick={() => {
                    setShowServerModal(true)
                }}
            >
                Create Server
            </button>
            <button
                onClick={() => {
                    setShowAllServersModal(true)
                }}
            >
                Public Servers
            </button>
            <CreateServerModal
                showServerModal={showServerModal}
                setShowServerModal={setShowServerModal}
            />
            <PublicServers
                setShowAllServersModal={setShowAllServersModal}
                showAllServersModal={showAllServersModal}
                publicServers={publicServers}
            />
            <button
                onClick={() => {
                    setShowJoinServerModal(true)
                }}
            >
                Join Server
            </button>
            <JoinServer
                showJoinServerModal={showJoinServerModal}
                setShowJoinServerModal={setShowJoinServerModal}
            />
            <Messages
                messages={messages}
                setMessages={setMessages}
                server={currentServer}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
            />
            {currentServer.id ? (
                <InputArea
                    callback={(message) => {
                        handleSubmit(message)
                    }}
                />
            ) : (
                <></>
            )}
        </main>
    )
}
