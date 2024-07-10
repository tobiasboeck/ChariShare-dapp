import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

export const ToastIconType = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning',
};

export const ToastContent = {
    custom: 'custom',
    allGood: 'allGood',
    somethingWentWrong: 'somethingWentWrong',
    pleaseFillOutEverything: 'pleaseFillOutEverything',
    notAllowed: 'notAllowed',
};

function Toast({ show, setShow, content, title, text, iconType }) {
    let titleToUse = title;
    let textToUse = text;
    let iconToUse = iconType;

    switch (content) {
        case ToastContent.allGood:
            titleToUse = 'Super';
            textToUse = 'You got successfully connected to your Metamask account';
            iconToUse = ToastIconType.success;
            break;
        case ToastContent.somethingWentWrong:
            titleToUse = 'Disconnected';
            textToUse = 'You got disconnected from Metamask';
            iconToUse = ToastIconType.error;
            break;
        case ToastContent.custom:
            break;
        default:
            console.warn('Unknown content type:', content);
            break;
    }

    let icon;
    switch (iconToUse) {
        case ToastIconType.success:
            icon = <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
            break;
        case ToastIconType.error:
            icon = <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
            break;
        case ToastIconType.warning:
            icon = <ExclamationCircleIcon className="h-6 w-6 text-orange-400" aria-hidden="true" />;
            break;
        case ToastIconType.info:
            icon = <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />;
            break;
        default:
            console.warn('Unknown icon type:', iconToUse);
            break;
    }

    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed top-[40px] right-[40px] z-50 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-300 dark:bg-darker shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">{icon}</div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">{titleToUse}</p>
                            <p className="mt-1 text-sm text-gray-500">{textToUse}</p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0">
                            <button
                                type="button"
                                className="inline-flex rounded-md text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => {
                                    setShow(false);
                                }}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}

export default Toast;
