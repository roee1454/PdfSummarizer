import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage
} from "@/components/ui/chat/chat-bubble";
import { Message } from "@/types";
import { Fragment } from "react/jsx-runtime";


interface MessagesContainerProps {
  messages: Message[];
}

export default function MessagesContainer({
  messages
}: MessagesContainerProps) {
  return (
    <>
      <ChatMessageList dir="rtl">
        {messages.map((message, index) => {
          return (
            <Fragment key={index}>
              {message.type === "message" && (
                <ChatBubble>
                  <ChatBubbleMessage className="text-white font-bold" variant={"sent"}>
                    {message.content}
                  </ChatBubbleMessage>
                </ChatBubble>
              )}

              {message.type === "message_file" && (
                <ChatBubble>
                  <ChatBubbleMessage className="text-white font-bold" variant={"sent"}>
                  </ChatBubbleMessage>
                </ChatBubble>
              )}

              {message.type === "reply" && (
                <ChatBubble variant="sent">
                  <ChatBubbleMessage className="text-white font-bold bg-slate-800">{message.content}</ChatBubbleMessage>
                </ChatBubble>
              )}

              {message.type === "reply_file" && (
                <ChatBubble  variant={"sent"}>
                  <ChatBubbleMessage className="text-white font-bold bg-slate-800">{message.content}</ChatBubbleMessage>
                </ChatBubble>
              )}

              {message.type === "loading" && (
                <ChatBubble  variant={"sent"}>
                    <ChatBubbleMessage isLoading className="text-white font-bold bg-slate-800">{message.content}</ChatBubbleMessage>
                </ChatBubble>
              )}

              

            </Fragment>
          );
        })}
      </ChatMessageList>
    </>
  );
}
