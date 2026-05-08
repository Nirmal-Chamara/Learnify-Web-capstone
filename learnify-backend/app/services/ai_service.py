import os
from openai import OpenAI
from app.models.chat_message import ChatMessage

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = (
    "You are Learnify's academic assistant. Help university students with "
    "study planning, coursework questions, scheduling advice, and productivity. "
    "Be concise, encouraging, and professional."
)

def get_ai_response(user_message: str, session_id: int, user_id: int) -> str:
    history = (
        ChatMessage.query
        .filter_by(session_id=session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(20)
        .all()
    )
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=1024,
        temperature=0.7,
    )
    return response.choices[0].message.content
