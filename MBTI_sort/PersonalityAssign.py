import sys


def assign_mbti(job_description):
    # keywords for each mbti preference
    extroversion = ["communication", "leadership", "teamwork", "sales", "marketing", "public", "team", "collaboration", "outgoing", "socializing", "networking", "charisma", "relationship", "influence", "energizing", "engaging", "persuasive", "social", "enthusiastic", "negotiation"]
    introversion = ["research", "writing", "analytical", "creative", "strategic", "independently", "reflection", "reserved", "thoughtful", "contemplative", "introspective", "observant", "intellectual", "solitary", "reflective", "insightful", "deliberate", "independently", "reserved", "thought-provoking"]
    sensing = ["detail", "practical", "technical", "observational", "efficient", "observant", "realistic", "hands-on", "concrete", "pragmatic", "conscientious", "procedural", "systematic", "methodical", "real-world", "specific", "pragmatic", "conscientious", "realistic", "prudent"]
    intuitive = ["creative", "strategic", "innovative", "insightful", "visionary", "imaginative", "abstract", "conceptual", "futuristic", "vision", "concepts", "pattern", "insights", "intuitive", "big-picture", "ideas", "discern", "perceive", "inspire", "forsee"]
    thinking = ["critical", "solve", "decisive", "strategic", "technical", "problem-solving", "logical", "analytical", "objective", "rational", "impartial", "strategies", "data", "systematic", "intellectual", "conceptual", "evaluation", "decision", "reasoning", "analysis"]
    feeling = ["empathetic", "communication", "resolution", "leadership", "creative", "compassionate", "emotional", "subjective", "harmonious", "relationship", "value", "considerate", "cohesion", "ethical", "supportive", "collaboration", "collaborate", "sympathetic", "nurture", "interpersonal"]
    judging = ["planning", "organization", "management", "decisive", "detail", "accountable", "detail-oriented", "structured", "scheduled", "systematic", "orderly", "goal", "goals", "results", "efficient", "methodical", "time-management", "proactive", "accountable", "productive"]
    perceiving = ["adaptable", "adaptability", "creative", "problem solving", "solve", "flexible", "exploration", "open-minded", "spontaneous", "curious", "divergent", "agile", "resourceful", "fluid", "discover", "curiosity", "versatile", "unconventional", "inquisitive", "innovative"]

    # Remove punctuation and make all words lowercase
    job_description = job_description.replace(":", "")
    job_description = job_description.replace(",", "")
    job_description = job_description.replace(".", "")
    job_description = job_description.lower().split()

    # initialize variables
    mbti = None
    introversion_percent = None
    extroversion_percent = None
    sensing_percent = None
    intuitive_percent = None
    thinking_percent = None
    feeling_percent = None
    judging_percent = None
    perceiving_percent = None
    final_percent = 0

    # Check for Introversion/Extroversion
    introversion_count = 0
    extroversion_count = 0
    for word in job_description:
        if word in introversion:
            introversion_count += 1
        if word in extroversion:
            extroversion_count += 1
    if introversion_count > extroversion_count:
        if introversion_count + extroversion_count != 0:
            introversion_percent = introversion_count / (introversion_count + extroversion_count)
        mbti = 'I'
    else:
        if introversion_count + extroversion_count != 0:
            extroversion_percent = extroversion_count / (introversion_count + extroversion_count)
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
        if sensing_count + intuition_count != 0:
            sensing_percent = sensing_count / (sensing_count + intuition_count)
        mbti += 'S'
    else:
        if sensing_count + intuition_count != 0:
            intuitive_percent = intuition_count / (sensing_count + intuition_count)
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
        if thinking_count + feeling_count != 0:
            thinking_percent = thinking_count / (thinking_count + feeling_count)
        mbti += 'T'
    else:
        if thinking_count + feeling_count != 0:
            feeling_percent = feeling_count / (thinking_count + feeling_count)
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
        if judging_count + perceiving_count != 0:
            judging_percent = judging_count / (judging_count + perceiving_count)
        mbti += 'J'
    else:
        if judging_count + perceiving_count != 0:
            perceiving_percent = perceiving_count / (judging_count + perceiving_count)
        mbti += 'P'

    # Calculate the final percentage
    for percent in [introversion_percent, extroversion_percent, sensing_percent, intuitive_percent, thinking_percent, feeling_percent, judging_percent, perceiving_percent]:
        if percent is not None:
            final_percent += percent
    final_percent /= 4
    mbti += str(round((final_percent * 100), 2))
    
    return mbti

# Get the job description from the command-line argument
args = sys.argv[1:]

job_description = args[0]

# Perform the MBTI calculation
mbti_result = assign_mbti(job_description)

# Output the MBTI result
print(mbti_result)
