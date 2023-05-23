# import csv
import sys


def assign_mbti(job_description):
    extroversion = ["communication", "leadership", "teamwork", "sales", "marketing", "public", "team", "collaboration", "outgoing", "socializing", "networking", "charisma", "relationship", "influence", "energizing", "engaging", "persuasive", "social", "enthusiastic", "negotiation"]
    introversion = ["research", "writing", "analytical", "creative", "strategic", "independently", "reflection", "reserved", "thoughtful", "contemplative", "introspective", "observant", "intellectual", "solitary", "reflective", "insightful", "deliberate", "independently", "reserved", "thought-provoking"]
    sensing = ["detail", "practical", "technical", "observational", "efficient", "observant", "realistic", "hands-on", "concrete", "pragmatic", "conscientious", "procedural", "systematic", "methodical", "real-world", "specific", "pragmatic", "conscientious", "realistic", "prudent"]
    intuitive = ["creative", "strategic", "innovative", "insightful", "visionary", "imaginative", "abstract", "conceptual", "futuristic", "vision", "concepts", "pattern", "insights", "intuitive", "big-picture", "ideas", "discern", "perceive", "inspire", "forsee"]
    thinking = ["critical", "solve", "decisive", "strategic", "technical", "problem-solving", "logical", "analytical", "objective", "rational", "impartial", "strategies", "data", "systematic", "intellectual", "conceptual", "evaluation", "decision", "reasoning", "analysis"]
    feeling = ["empathetic", "communication", "resolution", "leadership", "creative", "compassionate", "emotional", "subjective", "harmonious", "relationship", "value", "considerate", "cohesion", "ethical", "supportive", "collaboration", "collaborate", "sympathetic", "nurture", "interpersonal"]
    judging = ["planning", "organization", "management", "decisive", "detail", "accountable", "detail-oriented", "structured", "scheduled", "systematic", "orderly", "goal", "goals", "results", "efficient", "methodical", "time-management", "proactive", "accountable", "productive"]
    perceiving = ["adaptable", "adaptability", "creative", "problem solving", "solve", "flexible", "exploration", "open-minded", "spontaneous", "curious", "divergent", "agile", "resourceful", "fluid", "discover", "curiosity", "versatile", "unconventional", "inquisitive", "innovative"]
    job_description = job_description.replace(":", "")
    job_description = job_description.replace(",", "")
    job_description = job_description.replace(".", "")
    job_description = job_description.lower().split()
    mbti = None

    # Check for Introversion/Extroversion
    introversion_count = 0
    extroversion_count = 0
    for word in job_description:
        if word in introversion:
            introversion_count += 1
        if word in extroversion:
            extroversion_count += 1
    if introversion_count > extroversion_count:
        mbti = 'I'
    else:
        mbti = 'E'

    # Check for Sensing/Intuition
    sensing_count = 0
    intuition_count = 0
    for word in job_description:
        if word in sensing:
            sensing_count += 1
        if word in intuitive:
            intuition_count += 1
    if sensing_count > intuition_count:
        mbti += 'S'
    else:
        mbti += 'N'

    # Check for Thinking/Feeling
    thinking_count = 0
    feeling_count = 0
    for word in job_description:
        if word in thinking:
            thinking_count += 1
        if word in feeling:
            feeling_count += 1
    if thinking_count > feeling_count:
        mbti += 'T'
    else:
        mbti += 'F'

    # Check for Judging/Perceiving
    judging_count = 0
    perceiving_count = 0
    for word in job_description:
        if word in judging:
            judging_count += 1
        if word in perceiving:
            perceiving_count += 1
    if judging_count > perceiving_count:
        mbti += 'J'
    else:
        mbti += 'P'
    return mbti

# Get the job description from the command-line argument
args = sys.argv[1:]

job_description = args[0]

# Perform the MBTI calculation
mbti_result = assign_mbti(job_description)

# Output the MBTI result
print(mbti_result)
